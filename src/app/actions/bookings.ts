"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateBookingRef, hashPII } from "@/lib/utils";

export type BookingActionState = {
  error?: string;
  success?: boolean;
  bookingRef?: string;
};

export type ClientActionState = {
  error?: string;
  success?: boolean;
  clientId?: string;
};

/**
 * Create or find a client. CIN is hashed via SHA-256 before storage.
 * CNDP Loi 09-08 compliant — raw CIN never touches the database.
 */
export async function upsertClient(
  _prevState: ClientActionState,
  formData: FormData
): Promise<ClientActionState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profil introuvable." };

  const rawCIN = (formData.get("cin") as string).trim().toUpperCase();
  const cinHash = await hashPII(rawCIN);

  // Check if client already exists (by CIN hash)
  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("cin_hash", cinHash)
    .eq("tenant_id", profile.tenant_id)
    .single();

  if (existing) {
    // Update existing client info
    await supabase
      .from("clients")
      .update({
        full_name: formData.get("full_name") as string,
        full_name_ar: formData.get("full_name_ar") as string || null,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string || null,
        address: formData.get("address") as string || null,
        city: formData.get("city") as string || null,
        driving_license_number: formData.get("driving_license_number") as string || null,
        driving_license_expiry: formData.get("driving_license_expiry") as string || null,
      })
      .eq("id", existing.id);

    return { success: true, clientId: existing.id };
  }

  // Create new client
  const passportRaw = formData.get("passport") as string;
  const passportHash = passportRaw ? await hashPII(passportRaw.trim().toUpperCase()) : null;

  const { data: newClient, error } = await supabase
    .from("clients")
    .insert({
      tenant_id: profile.tenant_id,
      full_name: formData.get("full_name") as string,
      full_name_ar: formData.get("full_name_ar") as string || null,
      cin_hash: cinHash,
      passport_hash: passportHash,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string || null,
      address: formData.get("address") as string || null,
      city: formData.get("city") as string || null,
      driving_license_number: formData.get("driving_license_number") as string || null,
      driving_license_expiry: formData.get("driving_license_expiry") as string || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { success: true, clientId: newClient?.id };
}

/**
 * Check CIN hash against the cross-tenant CNDP blacklist.
 */
export async function checkBlacklist(cinRaw: string): Promise<{
  isBlacklisted: boolean;
  reason?: string;
  severity?: string;
}> {
  const supabase = await createClient();
  const cinHash = await hashPII(cinRaw.trim().toUpperCase());

  const { data } = await supabase
    .from("cndp_blacklist")
    .select("reason, severity")
    .eq("cin_hash", cinHash)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (data) {
    return {
      isBlacklisted: true,
      reason: data.reason,
      severity: data.severity,
    };
  }

  return { isBlacklisted: false };
}

/**
 * Create a new booking.
 * The PostgreSQL EXCLUDE USING gist constraint guarantees no double-booking.
 */
export async function createBooking(
  _prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profil introuvable." };

  const vehicleId = formData.get("vehicle_id") as string;
  const clientId = formData.get("client_id") as string;
  const pickupDatetime = formData.get("pickup_datetime") as string;
  const dropoffDatetime = formData.get("dropoff_datetime") as string;
  const pickupLocation = formData.get("pickup_location") as string || "Agence";
  const dropoffLocation = formData.get("dropoff_location") as string || "Agence";
  const dailyRate = parseFloat(formData.get("daily_rate_mad") as string);
  const cautionAmount = parseFloat(formData.get("caution_amount_mad") as string) || 0;
  const status = formData.get("status") as string || "pending";

  if (!vehicleId || !clientId || !pickupDatetime || !dropoffDatetime) {
    return { error: "Tous les champs obligatoires doivent être remplis." };
  }

  // Calculate duration and total
  const pickup = new Date(pickupDatetime);
  const dropoff = new Date(dropoffDatetime);
  const days = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));

  if (days < 1) {
    return { error: "La durée minimum est de 1 jour." };
  }

  // Check for active season rate
  const today = new Date().toISOString().split("T")[0];
  const { data: seasonRate } = await supabase
    .from("season_rates")
    .select("multiplier")
    .eq("tenant_id", profile.tenant_id)
    .eq("is_active", true)
    .lte("start_date", today)
    .gte("end_date", today)
    .limit(1)
    .single();

  const multiplier = seasonRate?.multiplier || 1.0;
  const totalAmount = dailyRate * days * multiplier;

  const bookingRef = generateBookingRef();

  const { error } = await supabase.from("bookings").insert({
    tenant_id: profile.tenant_id,
    vehicle_id: vehicleId,
    client_id: clientId,
    booking_ref: bookingRef,
    status,
    pickup_location: pickupLocation,
    dropoff_location: dropoffLocation,
    pickup_datetime: pickupDatetime,
    dropoff_datetime: dropoffDatetime,
    daily_rate_mad: dailyRate,
    total_amount_mad: totalAmount,
    caution_amount_mad: cautionAmount,
    season_multiplier: multiplier,
  });

  if (error) {
    // The EXCLUDE constraint will raise an error for double-bookings
    if (error.message.includes("no_double_booking") || error.message.includes("conflicting key")) {
      return {
        error: "Ce véhicule est déjà réservé pour cette période. Veuillez choisir d'autres dates.",
      };
    }
    return { error: error.message };
  }

  // Update vehicle status to reserved/rented
  if (status === "confirmed" || status === "active") {
    await supabase
      .from("vehicles")
      .update({ status: status === "active" ? "rented" : "reserved" })
      .eq("id", vehicleId);
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/fleet");
  return { success: true, bookingRef };
}

/**
 * Update booking status (state machine transitions).
 */
export async function updateBookingStatus(
  bookingId: string,
  newStatus: string
): Promise<BookingActionState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  // Valid transitions
  const validTransitions: Record<string, string[]> = {
    quote: ["pending", "cancelled"],
    pending: ["confirmed", "cancelled"],
    confirmed: ["active", "cancelled"],
    active: ["completed"],
    completed: [],
    cancelled: [],
  };

  // Get current booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("status, vehicle_id")
    .eq("id", bookingId)
    .single();

  if (!booking) return { error: "Réservation introuvable." };

  const allowed = validTransitions[booking.status] || [];
  if (!allowed.includes(newStatus)) {
    return {
      error: `Transition invalide: ${booking.status} → ${newStatus}`,
    };
  }

  const updates: Record<string, unknown> = { status: newStatus };
  if (newStatus === "cancelled") {
    updates.cancelled_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", bookingId);

  if (error) return { error: error.message };

  // Update vehicle status based on booking transition
  if (newStatus === "active") {
    await supabase.from("vehicles").update({ status: "rented" }).eq("id", booking.vehicle_id);
  } else if (newStatus === "completed" || newStatus === "cancelled") {
    await supabase.from("vehicles").update({ status: "available" }).eq("id", booking.vehicle_id);
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/fleet");
  return { success: true };
}

/**
 * Get all bookings for the current tenant.
 */
export async function getBookings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicle:vehicles(plate_number, brand, model), client:clients(full_name, phone)")
    .order("created_at", { ascending: false });

  if (error) return { bookings: [], error: error.message };
  return { bookings: data || [], error: null };
}

/**
 * Get all clients for the current tenant.
 */
export async function getClients() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return { clients: [], error: error.message };
  return { clients: data || [], error: null };
}
