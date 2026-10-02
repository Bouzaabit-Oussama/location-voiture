/* ============================================
   Location Voiture — Database Type Definitions
   Auto-generated types will be placed here once
   Supabase CLI is connected. For now, these are
   the manually maintained domain types.
   ============================================ */

export type UserRole = "superadmin" | "admin" | "manager" | "agent" | "driver";

export type BookingStatus =
  | "quote"          // WhatsApp quote sent
  | "pending"        // Awaiting payment/caution
  | "confirmed"      // Caution received
  | "active"         // Vehicle picked up
  | "completed"      // Vehicle returned
  | "cancelled";     // Cancelled by client or agency

export type VehicleStatus =
  | "available"
  | "rented"
  | "maintenance"
  | "reserved"
  | "decommissioned";

export type InspectionType = "pickup" | "return";

export type DamageLevel = "none" | "minor" | "moderate" | "severe";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  ice: string;           // Identifiant Commun de l'Entreprise
  if_number: string;     // Identifiant Fiscal
  rc_number: string;     // Registre du Commerce
  city: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subscription_status?: 'trial' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  trial_ends_at?: string;
  max_vehicles?: number;
  is_superadmin?: boolean;
}

export interface UserProfile {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  full_name_ar: string | null;  // Arabic name for DGSN docs
  role: UserRole;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  tenant_id: string;
  plate_number: string;         // Moroccan format: XXXXX-A-XX
  brand: string;
  model: string;
  year: number;
  category: string;             // Economy, Compact, SUV, Luxury, etc.
  fuel_type: "diesel" | "gasoline" | "hybrid" | "electric";
  transmission: "manual" | "automatic";
  seats: number;
  color: string;
  vin: string;
  mileage_km: number;
  daily_rate_mad: number;
  status: VehicleStatus;
  insurance_expiry: string;
  technical_visit_expiry: string;  // Visite technique
  vignette_expiry: string;
  photo_urls: string[];
  gps_device_imei: string | null;  // Teltonika IMEI
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Booking {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  client_id: string;
  booking_ref: string;
  status: BookingStatus;
  pickup_location: string;
  dropoff_location: string;
  booking_period: string;           // tsrange [start, end)
  pickup_datetime: string;
  dropoff_datetime: string;
  daily_rate_mad: number;
  total_amount_mad: number;
  caution_amount_mad: number;
  caution_status: "pending" | "held" | "released" | "deducted";
  season_multiplier: number;        // 1.0 = normal, 1.5 = MRE summer peak
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  tenant_id: string;
  full_name: string;
  full_name_ar: string | null;
  cin_hash: string;               // SHA-256 hashed CIN — CNDP compliant
  passport_hash: string | null;   // SHA-256 hashed Passport — CNDP compliant
  phone: string;
  email: string | null;
  address: string;
  city: string;
  driving_license_number: string;
  driving_license_expiry: string;
  is_blacklisted: boolean;
  blacklist_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inspection {
  id: string;
  tenant_id: string;
  booking_id: string;
  vehicle_id: string;
  inspector_id: string;
  type: InspectionType;
  mileage_km: number;
  fuel_level: number;             // 0-100 percentage
  damage_map: DamagePoint[];
  photo_urls: string[];
  notes: string | null;
  signature_url: string | null;   // Client signature
  synced: boolean;                // IndexedDB sync status
  created_at: string;
}

export interface DamagePoint {
  x: number;                      // Relative X position on vehicle diagram
  y: number;                      // Relative Y position on vehicle diagram
  zone: string;                   // e.g., "front_left_door", "rear_bumper"
  level: DamageLevel;
  description: string;
  photo_url: string | null;
}

export interface Infraction {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  booking_id: string | null;
  client_id: string | null;
  infraction_date: string;
  infraction_type: "speeding" | "parking" | "red_light" | "accident" | "other";
  amount_mad: number | null;
  location: string;
  radar_reference: string | null;
  status: "pending" | "client_billed" | "dgsn_transferred" | "resolved";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeasonRate {
  id: string;
  tenant_id: string;
  name: string;                   // e.g., "MRE Summer 2026"
  start_date: string;
  end_date: string;
  multiplier: number;             // e.g., 1.5 for 50% markup
  is_active: boolean;
}
