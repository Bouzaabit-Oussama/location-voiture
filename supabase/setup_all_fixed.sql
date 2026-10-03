-- ============================================
-- Location Voiture — Migration 001: Extensions & Foundation
-- Milestone: MA (Tenant Isolation)
-- ============================================

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";    -- Required for tsrange EXCLUDE constraints
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- For gen_random_uuid()

-- ============================================
-- TENANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ice TEXT,                              -- Identifiant Commun de l'Entreprise (15 digits)
  if_number TEXT,                        -- Identifiant Fiscal
  rc_number TEXT,                        -- Registre du Commerce
  city TEXT NOT NULL DEFAULT 'Casablanca',
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  full_name_ar TEXT,                     -- Arabic name for DGSN documents
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('superadmin', 'admin', 'manager', 'agent', 'driver')),
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_tenant ON user_profiles(tenant_id);

-- ============================================
-- ROW LEVEL SECURITY: TENANTS
-- ============================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "superadmin_full_access" ON tenants
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'superadmin'
    )
  );

CREATE POLICY "tenant_members_read" ON tenants
  FOR SELECT
  USING (
    id = (
      SELECT tenant_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

-- ============================================
-- ROW LEVEL SECURITY: USER PROFILES
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_tenant" ON user_profiles
  FOR SELECT
  USING (
    tenant_id = (
      SELECT tenant_id FROM user_profiles AS up
      WHERE up.id = auth.uid()
    )
  );

CREATE POLICY "admins_manage_own_tenant" ON user_profiles
  FOR ALL
  USING (
    tenant_id = (
      SELECT tenant_id FROM user_profiles AS up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "superadmin_full_access_profiles" ON user_profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles AS up
      WHERE up.id = auth.uid()
      AND up.role = 'superadmin'
    )
  );

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_tenants
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ============================================
-- Location Voiture — Migration 002: Fleet & Vehicles
-- Milestone: MB (Fleet Management)
-- ============================================

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  plate_number TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'economy',
  fuel_type TEXT NOT NULL DEFAULT 'diesel' CHECK (fuel_type IN ('diesel', 'gasoline', 'hybrid', 'electric')),
  transmission TEXT NOT NULL DEFAULT 'manual' CHECK (transmission IN ('manual', 'automatic')),
  seats INTEGER NOT NULL DEFAULT 5,
  color TEXT,
  vin TEXT,
  mileage_km INTEGER NOT NULL DEFAULT 0,
  daily_rate_mad DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'reserved', 'decommissioned')),
  insurance_expiry DATE,
  technical_visit_expiry DATE,    -- Visite technique
  vignette_expiry DATE,
  photo_urls TEXT[] DEFAULT '{}',
  gps_device_imei TEXT,           -- Teltonika IMEI
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT unique_plate_per_tenant UNIQUE (tenant_id, plate_number)
);

CREATE INDEX idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX idx_vehicles_status ON vehicles(tenant_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_vehicles_category ON vehicles(tenant_id, category) WHERE deleted_at IS NULL;

-- ============================================
-- ROW LEVEL SECURITY: VEHICLES
-- ============================================
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_vehicles" ON vehicles
  FOR ALL
  USING (
    tenant_id = (
      SELECT tenant_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

CREATE POLICY "superadmin_vehicles" ON vehicles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'superadmin'
    )
  );

-- ============================================
-- FLEET COMPLIANCE TRIGGER
-- Ministère du Transport: min 7 vehicles, max 5-year age
-- ============================================
CREATE OR REPLACE FUNCTION check_fleet_compliance()
RETURNS TRIGGER AS $$
DECLARE
  vehicle_count INTEGER;
  vehicle_age INTEGER;
BEGIN
  -- Check vehicle age: max 5 years old at registration
  IF TG_OP = 'INSERT' THEN
    vehicle_age := EXTRACT(YEAR FROM now()) - NEW.year;
    IF vehicle_age > 5 THEN
      RAISE EXCEPTION 'Vehicle age (%) exceeds 5-year maximum per Ministère du Transport regulations', vehicle_age;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_fleet_compliance
  BEFORE INSERT ON vehicles
  FOR EACH ROW EXECUTE FUNCTION check_fleet_compliance();

-- Fleet count advisory (non-blocking, logged to audit)
CREATE OR REPLACE FUNCTION check_fleet_minimum()
RETURNS TRIGGER AS $$
DECLARE
  vehicle_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO vehicle_count
  FROM vehicles
  WHERE tenant_id = NEW.tenant_id
  AND deleted_at IS NULL
  AND status != 'decommissioned';

  -- Log warning if below minimum (7 vehicles per Ministère du Transport)
  IF vehicle_count < 7 THEN
    RAISE WARNING 'Tenant fleet has % active vehicles. Minimum 7 required per Ministère du Transport.', vehicle_count;
  END IF;

  RETURN NULL; -- AFTER trigger, no row modification
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER advisory_fleet_minimum
  AFTER INSERT OR DELETE OR UPDATE OF status ON vehicles
  FOR EACH STATEMENT EXECUTE FUNCTION check_fleet_minimum();

CREATE TRIGGER set_updated_at_vehicles
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ============================================
-- Location Voiture — Migration 003: Clients, Bookings & Seasonality
-- Milestone: MC (Booking Engine)
-- ============================================

-- ============================================
-- CLIENTS TABLE (CNDP Loi 09-08 Compliant)
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  full_name TEXT NOT NULL,
  full_name_ar TEXT,
  cin_hash TEXT NOT NULL,                     -- SHA-256 hash of CIN (NEVER store raw CIN)
  passport_hash TEXT,                         -- SHA-256 hash of passport number
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  driving_license_number TEXT,
  driving_license_expiry DATE,
  is_blacklisted BOOLEAN NOT NULL DEFAULT false,
  blacklist_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_clients_cin_hash ON clients(cin_hash);
CREATE INDEX idx_clients_phone ON clients(tenant_id, phone);

-- ============================================
-- SEASON RATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS season_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00 CHECK (multiplier >= 0.5 AND multiplier <= 3.0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_season_dates CHECK (start_date < end_date)
);

CREATE INDEX idx_season_rates_tenant ON season_rates(tenant_id);

-- ============================================
-- BOOKINGS TABLE with tsrange concurrency control
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  booking_ref TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'quote' CHECK (
    status IN ('quote', 'pending', 'confirmed', 'active', 'completed', 'cancelled')
  ),
  pickup_location TEXT NOT NULL DEFAULT 'Agence',
  dropoff_location TEXT NOT NULL DEFAULT 'Agence',
  booking_period TSTZRANGE NOT NULL,          -- [pickup, dropoff) inclusive-exclusive
  pickup_datetime TIMESTAMPTZ NOT NULL,
  dropoff_datetime TIMESTAMPTZ NOT NULL,
  daily_rate_mad DECIMAL(10,2) NOT NULL,
  total_amount_mad DECIMAL(10,2) NOT NULL,
  caution_amount_mad DECIMAL(10,2) NOT NULL DEFAULT 0,
  caution_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    caution_status IN ('pending', 'held', 'released', 'deducted')
  ),
  season_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ,

  -- ============================================
  -- CRITICAL: Concurrency-safe double-booking prevention
  -- Uses btree_gist to create an exclusion constraint on tsrange
  -- [) bounds = inclusive start, exclusive end
  -- Only enforced for non-cancelled bookings
  -- ============================================
  CONSTRAINT no_double_booking
    EXCLUDE USING gist (
      vehicle_id WITH =,
      booking_period WITH &&
    ) WHERE (status NOT IN ('cancelled', 'quote'))
);

CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_status ON bookings(tenant_id, status);
CREATE INDEX idx_bookings_period ON bookings USING gist (booking_period);
CREATE INDEX idx_bookings_ref ON bookings(booking_ref);

-- ============================================
-- ROW LEVEL SECURITY: CLIENTS
-- ============================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_clients" ON clients
  FOR ALL
  USING (
    tenant_id = (
      SELECT tenant_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

-- ============================================
-- ROW LEVEL SECURITY: BOOKINGS
-- ============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_bookings" ON bookings
  FOR ALL
  USING (
    tenant_id = (
      SELECT tenant_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

-- ============================================
-- ROW LEVEL SECURITY: SEASON RATES
-- ============================================
ALTER TABLE season_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_season_rates" ON season_rates
  FOR ALL
  USING (
    tenant_id = (
      SELECT tenant_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER set_updated_at_clients
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_bookings
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-set booking_period from pickup/dropoff datetimes
CREATE OR REPLACE FUNCTION set_booking_period()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_period := tstzrange(NEW.pickup_datetime, NEW.dropoff_datetime, '[)');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_set_booking_period
  BEFORE INSERT OR UPDATE OF pickup_datetime, dropoff_datetime ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_period();
-- ============================================
-- Location Voiture — Migration 004: Inspections & Infractions
-- Milestones: MD (Inspections) + ME (Legal Suite)
-- ============================================

-- ============================================
-- INSPECTIONS TABLE (Fiche état des lieux)
-- ============================================
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  inspector_id UUID NOT NULL REFERENCES user_profiles(id),
  type TEXT NOT NULL CHECK (type IN ('pickup', 'return')),
  mileage_km INTEGER NOT NULL,
  fuel_level INTEGER NOT NULL CHECK (fuel_level >= 0 AND fuel_level <= 100),
  damage_map JSONB NOT NULL DEFAULT '[]',    -- Array of DamagePoint objects
  photo_urls TEXT[] DEFAULT '{}',
  notes TEXT,
  signature_url TEXT,                        -- Client signature image
  synced BOOLEAN NOT NULL DEFAULT false,     -- IndexedDB sync status
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inspections_tenant ON inspections(tenant_id);
CREATE INDEX idx_inspections_booking ON inspections(booking_id);
CREATE INDEX idx_inspections_vehicle ON inspections(vehicle_id);

-- ============================================
-- INFRACTIONS TABLE (NARSA / DGSN)
-- ============================================
CREATE TABLE IF NOT EXISTS infractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  booking_id UUID REFERENCES bookings(id),   -- NULL if not yet matched
  client_id UUID REFERENCES clients(id),
  type TEXT NOT NULL CHECK (type IN ('speeding', 'parking', 'red_light', 'other')),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('narsa', 'dgsn', 'manual')),
  infraction_datetime TIMESTAMPTZ NOT NULL,
  fine_amount_mad DECIMAL(10,2) NOT NULL DEFAULT 0,
  location TEXT,
  liability_transferred BOOLEAN NOT NULL DEFAULT false,
  transfer_document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_infractions_tenant ON infractions(tenant_id);
CREATE INDEX idx_infractions_vehicle ON infractions(vehicle_id);
CREATE INDEX idx_infractions_datetime ON infractions(infraction_datetime);

-- ============================================
-- NARSA LIABILITY MATCHING FUNCTION
-- Cross-references infraction timestamps against booking tsrange ledger
-- ============================================
CREATE OR REPLACE FUNCTION match_infraction_to_booking()
RETURNS TRIGGER AS $$
DECLARE
  matched_booking RECORD;
BEGIN
  -- Find the booking that covers the infraction timestamp
  SELECT b.id AS booking_id, b.client_id
  INTO matched_booking
  FROM bookings b
  WHERE b.vehicle_id = NEW.vehicle_id
    AND b.tenant_id = NEW.tenant_id
    AND b.booking_period @> NEW.infraction_datetime
    AND b.status IN ('active', 'completed')
  LIMIT 1;

  IF matched_booking IS NOT NULL THEN
    NEW.booking_id := matched_booking.booking_id;
    NEW.client_id := matched_booking.client_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_match_infraction
  BEFORE INSERT ON infractions
  FOR EACH ROW EXECUTE FUNCTION match_infraction_to_booking();

-- ============================================
-- CNDP BLACKLIST (decentralized, SHA-256 hashed)
-- ============================================
CREATE TABLE IF NOT EXISTS cndp_blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cin_hash TEXT NOT NULL,                   -- SHA-256 hashed CIN
  reason TEXT NOT NULL,
  reported_by_tenant_id UUID NOT NULL REFERENCES tenants(id),
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('warning', 'block')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ                    -- NULL = permanent
);

CREATE INDEX idx_blacklist_cin_hash ON cndp_blacklist(cin_hash) WHERE is_active = true;

-- Blacklist does NOT have tenant RLS — it's cross-tenant by design
-- But only authenticated users can read, and only admins can write
ALTER TABLE cndp_blacklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_blacklist" ON cndp_blacklist
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "admin_write_blacklist" ON cndp_blacklist
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'superadmin')
    )
  );

-- ============================================
-- RLS for inspections & infractions
-- ============================================
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_inspections" ON inspections
  FOR ALL
  USING (
    tenant_id = (
      SELECT tenant_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

ALTER TABLE infractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_infractions" ON infractions
  FOR ALL
  USING (
    tenant_id = (
      SELECT tenant_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

CREATE TRIGGER set_updated_at_infractions
  BEFORE UPDATE ON infractions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ============================================
-- SUPERADMIN MIGRATION
-- ============================================
-- Create subscription statuses for tenants
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled', 'unpaid'));
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '14 days');
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS max_vehicles INTEGER DEFAULT 10;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT false;

-- Add a function to check if user is superadmin
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT t.is_superadmin INTO is_admin
  FROM user_profiles p
  JOIN tenants t ON p.tenant_id = t.id
  WHERE p.id = auth.uid();
  
  RETURN COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SuperAdmin RLS Policies: SuperAdmins can see ALL tenants
CREATE POLICY "SuperAdmins can view all tenants" 
ON tenants FOR SELECT 
USING (is_superadmin());

CREATE POLICY "SuperAdmins can update all tenants" 
ON tenants FOR UPDATE 
USING (is_superadmin());

-- Set your main agency as the superadmin
UPDATE tenants SET is_superadmin = true WHERE name = 'Location Voiture Maroc' OR id = (SELECT id FROM tenants ORDER BY created_at ASC LIMIT 1);
