"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type FleetActionState = {
  error?: string;
  success?: boolean;
};

/**
 * Add a new vehicle to the tenant's fleet.
 * Enforced by DB triggers: max 5-year age, min 7 vehicles advisory.
 */
export async function addVehicle(
  _prevState: FleetActionState,
  formData: FormData
): Promise<FleetActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  // Get tenant_id from profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id, role")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profil introuvable." };
  if (!["admin", "manager"].includes(profile.role)) {
    return { error: "Permission refusée. Seuls les administrateurs peuvent ajouter des véhicules." };
  }

  const year = parseInt(formData.get("year") as string, 10);
  const currentYear = new Date().getFullYear();

  // Client-side age validation (DB trigger also enforces this)
  if (currentYear - year > 5) {
    return {
      error: `Véhicule trop ancien (${currentYear - year} ans). Maximum 5 ans autorisé par le Ministère du Transport.`,
    };
  }

  const vehicleData = {
    tenant_id: profile.tenant_id,
    plate_number: (formData.get("plate_number") as string).toUpperCase().trim(),
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    year,
    category: formData.get("category") as string || "economy",
    fuel_type: formData.get("fuel_type") as string || "diesel",
    transmission: formData.get("transmission") as string || "manual",
    seats: parseInt(formData.get("seats") as string, 10) || 5,
    color: formData.get("color") as string || "",
    vin: formData.get("vin") as string || "",
    mileage_km: parseInt(formData.get("mileage_km") as string, 10) || 0,
    daily_rate_mad: parseFloat(formData.get("daily_rate_mad") as string) || 0,
    insurance_expiry: formData.get("insurance_expiry") as string || null,
    technical_visit_expiry: formData.get("technical_visit_expiry") as string || null,
    vignette_expiry: formData.get("vignette_expiry") as string || null,
    gps_device_imei: formData.get("gps_device_imei") as string || null,
  };

  const { error } = await supabase.from("vehicles").insert(vehicleData);

  if (error) {
    if (error.message.includes("unique_plate_per_tenant")) {
      return { error: "Un véhicule avec cette immatriculation existe déjà." };
    }
    if (error.message.includes("5-year maximum")) {
      return { error: "Véhicule trop ancien. Maximum 5 ans." };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/fleet");
  return { success: true };
}

/**
 * Update vehicle details.
 */
export async function updateVehicle(
  vehicleId: string,
  _prevState: FleetActionState,
  formData: FormData
): Promise<FleetActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const updates: Record<string, unknown> = {};
  const fields = [
    "plate_number", "brand", "model", "category", "fuel_type",
    "transmission", "color", "vin", "gps_device_imei",
    "insurance_expiry", "technical_visit_expiry", "vignette_expiry",
  ];

  for (const field of fields) {
    const value = formData.get(field);
    if (value !== null && value !== "") {
      updates[field] = field === "plate_number"
        ? (value as string).toUpperCase().trim()
        : value;
    }
  }

  // Numeric fields
  const numericFields = ["seats", "mileage_km", "year"];
  for (const field of numericFields) {
    const value = formData.get(field);
    if (value) updates[field] = parseInt(value as string, 10);
  }

  const dailyRate = formData.get("daily_rate_mad");
  if (dailyRate) updates.daily_rate_mad = parseFloat(dailyRate as string);

  const status = formData.get("status");
  if (status) updates.status = status;

  const { error } = await supabase
    .from("vehicles")
    .update(updates)
    .eq("id", vehicleId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/fleet");
  return { success: true };
}

/**
 * Soft-delete a vehicle (set deleted_at, status = decommissioned).
 * NEVER hard deletes — non-destructive by design.
 */
export async function decommissionVehicle(
  vehicleId: string
): Promise<FleetActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("vehicles")
    .update({
      status: "decommissioned",
      deleted_at: new Date().toISOString(),
    })
    .eq("id", vehicleId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/fleet");
  return { success: true };
}

/**
 * Get all active vehicles for the current tenant.
 * RLS automatically filters by tenant_id.
 */
export async function getFleetVehicles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return { vehicles: [], error: error.message };
  return { vehicles: data || [], error: null };
}

/**
 * Get fleet compliance summary for the current tenant.
 */
export async function getFleetCompliance() {
  const supabase = await createClient();

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, year, status, insurance_expiry, technical_visit_expiry, vignette_expiry")
    .is("deleted_at", null)
    .neq("status", "decommissioned");

  if (!vehicles) return { total: 0, compliant: true, issues: [] };

  const now = new Date();
  const issues: string[] = [];

  // Check fleet size
  if (vehicles.length < 7) {
    issues.push(`Flotte sous le minimum légal: ${vehicles.length}/7 véhicules`);
  }

  // Check document expiries
  for (const v of vehicles) {
    if (v.insurance_expiry && new Date(v.insurance_expiry) < now) {
      issues.push(`Assurance expirée pour véhicule ID ${v.id.slice(0, 8)}`);
    }
    if (v.technical_visit_expiry && new Date(v.technical_visit_expiry) < now) {
      issues.push(`Visite technique expirée pour véhicule ID ${v.id.slice(0, 8)}`);
    }
    if (v.vignette_expiry && new Date(v.vignette_expiry) < now) {
      issues.push(`Vignette expirée pour véhicule ID ${v.id.slice(0, 8)}`);
    }
  }

  return {
    total: vehicles.length,
    compliant: issues.length === 0,
    issues,
  };
}
