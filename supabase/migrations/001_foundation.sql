-- ============================================
-- FleetMA — Migration 001: Extensions & Foundation
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
