-- ============================================
-- FleetMA — Migration 004: Inspections & Infractions
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
