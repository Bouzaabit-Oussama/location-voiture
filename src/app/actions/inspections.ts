"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type InspectionActionState = {
  error?: string;
  success?: boolean;
  inspectionId?: string;
};

/**
 * Create a new inspection (check-in or check-out).
 * This endpoint is typically called by the Background Sync service worker
 * or directly when online.
 */
export async function createInspection(
  data: any
): Promise<InspectionActionState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profil introuvable." };

  const {
    booking_id,
    vehicle_id,
    type,
    fuel_level,
    mileage_km,
    cleanliness,
    damage_marks,
    notes,
    client_signature,
    agent_signature,
  } = data;

  if (!booking_id || !vehicle_id || !type || fuel_level === undefined || !mileage_km) {
    return { error: "Données d'inspection incomplètes." };
  }

  const { data: inspection, error } = await supabase
    .from("inspections")
    .insert({
      tenant_id: profile.tenant_id,
      booking_id,
      vehicle_id,
      inspector_id: user.id,
      type,
      fuel_level,
      mileage_km,
      cleanliness,
      damage_marks,
      notes,
      client_signature,
      agent_signature,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Update vehicle mileage if check-out or check-in
  if (mileage_km > 0) {
    await supabase
      .from("vehicles")
      .update({ mileage_km })
      .eq("id", vehicle_id);
  }

  revalidatePath("/dashboard/inspections");
  revalidatePath("/dashboard/fleet");
  return { success: true, inspectionId: inspection.id };
}

/**
 * Get all inspections for the current tenant.
 */
export async function getInspections() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inspections")
    .select("*, vehicle:vehicles(plate_number, brand, model), booking:bookings(booking_ref), inspector:user_profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) return { inspections: [], error: error.message };
  return { inspections: data || [], error: null };
}
