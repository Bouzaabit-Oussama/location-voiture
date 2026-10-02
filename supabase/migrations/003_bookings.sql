-- ============================================
-- FleetMA — Migration 003: Clients, Bookings & Seasonality
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
