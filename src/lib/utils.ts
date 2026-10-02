import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Hash a CIN or Passport number using SHA-256.
 * CNDP Loi 09-08 compliance: PII must be hashed before storage or network transmission.
 */
export async function hashPII(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toUpperCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Format Moroccan Dirham currency */
export function formatMAD(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format a date in Moroccan locale */
export function formatDateMA(date: Date | string, locale: string = "fr-MA"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/** Validate Moroccan CIN format (1-2 letters + 5-6 digits) */
export function isValidCIN(cin: string): boolean {
  return /^[A-Z]{1,2}\d{5,6}$/i.test(cin.trim());
}

/** Validate Moroccan phone number (+212 or 0 prefix) */
export function isValidMoroccanPhone(phone: string): boolean {
  return /^(\+212|0)[5-7]\d{8}$/.test(phone.replace(/\s/g, ""));
}

/** Validate ICE (Identifiant Commun de l'Entreprise) — 15 digits */
export function isValidICE(ice: string): boolean {
  return /^\d{15}$/.test(ice.trim());
}

/** Generate a booking reference (e.g., FMA-2026-A3X9K) */
export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FMA-${year}-${code}`;
}
