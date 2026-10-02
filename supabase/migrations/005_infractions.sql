-- Location Voiture — Migration 005: Infractions

CREATE TYPE infraction_type AS ENUM ('speeding', 'parking', 'red_light', 'accident', 'other');
CREATE TYPE infraction_status AS ENUM ('pending', 'client_billed', 'dgsn_transferred', 'resolved');

CREATE TABLE public.infractions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    
    infraction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    infraction_type infraction_type NOT NULL,
    amount_mad DECIMAL(10, 2),
    location TEXT NOT NULL,
    radar_reference TEXT,
    
    status infraction_status DEFAULT 'pending',
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for temporal mapping lookups
CREATE INDEX idx_infractions_vehicle_date ON public.infractions(vehicle_id, infraction_date);

-- RLS Policies
ALTER TABLE public.infractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view their own infractions"
    ON public.infractions FOR SELECT
    USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Tenants can insert their own infractions"
    ON public.infractions FOR INSERT
    WITH CHECK (tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Tenants can update their own infractions"
    ON public.infractions FOR UPDATE
    USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Tenants can delete their own infractions"
    ON public.infractions FOR DELETE
    USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()));
