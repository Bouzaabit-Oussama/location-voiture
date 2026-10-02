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
