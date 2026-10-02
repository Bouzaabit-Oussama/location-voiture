-- Create subscription statuses for tenants
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled', 'unpaid'));
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '14 days');
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS max_vehicles INTEGER DEFAULT 10;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT false;

-- Add a function to check if user is superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT t.is_superadmin INTO is_admin
  FROM public.profiles p
  JOIN public.tenants t ON p.tenant_id = t.id
  WHERE p.id = auth.uid();
  
  RETURN COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SuperAdmin RLS Policies: SuperAdmins can see ALL tenants
CREATE POLICY "SuperAdmins can view all tenants" 
ON public.tenants FOR SELECT 
USING (is_superadmin());

CREATE POLICY "SuperAdmins can update all tenants" 
ON public.tenants FOR UPDATE 
USING (is_superadmin());

-- Set a specific tenant as the superadmin (the agency of the SaaS owner)
-- We will just set the very first tenant created as the superadmin for bootstrap
UPDATE public.tenants SET is_superadmin = true WHERE name = 'Location Voiture Maroc' OR id = (SELECT id FROM public.tenants ORDER BY created_at ASC LIMIT 1);
