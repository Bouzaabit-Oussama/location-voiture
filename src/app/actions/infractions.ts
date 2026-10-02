"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Infraction } from "@/types/database";

/**
 * Creates a new infraction and automatically maps it to a client and booking
 * based on temporal intersection (tsrange) using Supabase/PostgreSQL.
 */
export async function createAndMapInfraction(data: Partial<Infraction>) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profil introuvable." };

  if (!data.vehicle_id || !data.infraction_date || !data.infraction_type) {
    return { error: "Données d'infraction incomplètes (véhicule, date, type requis)." };
  }

  // Core Temporal Engine Logic:
  // We look for a booking for this specific vehicle where the infraction_date
  // falls exactly within the booking_period (Postgres tsrange: start <= date < end).
  // The PostgreSQL @> operator checks if a range contains an element.
  
  const { data: bookingOverlap, error: searchError } = await supabase
    .rpc('find_booking_for_infraction', {
      p_vehicle_id: data.vehicle_id,
      p_infraction_date: data.infraction_date
    });

  // If RPC is not available, we can do it via a direct PostgREST filter if we expose a view,
  // but since we want to avoid custom RPCs if we can do it with standard ORM, let's try raw REST.
  // Actually, Supabase JS doesn't natively support `@>` on tsrange out-of-the-box easily without `contains` or raw queries.
  // We will use the `contains` filter which maps to `@>`.
  
  const { data: matchingBooking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, client_id")
    .eq("vehicle_id", data.vehicle_id)
    .eq("tenant_id", profile.tenant_id)
    .contains("booking_period", `[${data.infraction_date}, ${data.infraction_date}]`)
    .single();

  const booking_id = matchingBooking ? matchingBooking.id : null;
  const client_id = matchingBooking ? matchingBooking.client_id : null;

  const { data: infraction, error } = await supabase
    .from("infractions")
    .insert({
      tenant_id: profile.tenant_id,
      vehicle_id: data.vehicle_id,
      infraction_date: data.infraction_date,
      infraction_type: data.infraction_type,
      amount_mad: data.amount_mad,
      location: data.location || "Inconnu",
      radar_reference: data.radar_reference,
      notes: data.notes,
      booking_id,
      client_id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/legal");
  return { 
    success: true, 
    infractionId: infraction.id,
    mapped_to_client: !!client_id
  };
}

/**
 * Gets all infractions for the tenant with joined vehicle and client data.
 */
export async function getInfractions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("infractions")
    .select(`
      *,
      vehicle:vehicles(plate_number, brand, model),
      client:clients(full_name, phone, driving_license_number),
      booking:bookings(booking_ref)
    `)
    .order("infraction_date", { ascending: false });

  if (error) return { infractions: [], error: error.message };
  return { infractions: data || [], error: null };
}

export async function getInfractionById(id: string) {
  const supabase = await createClient();

  const { data: infraction, error } = await supabase
    .from("infractions")
    .select(`
      *,
      vehicle:vehicles(plate_number, brand, model, insurance_company),
      client:clients(full_name, identity_card_number, driving_license_number, address)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching infraction:", error);
    return { error: error.message };
  }

  return { infraction };
}
