"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthState = {
  error?: string;
  success?: boolean;
};

/**
 * Sign up a new agency owner.
 * Creates: Supabase Auth user → triggers tenant + user_profile creation via DB trigger.
 */
export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const agencyName = formData.get("agency_name") as string;
  const city = formData.get("city") as string;
  const phone = formData.get("phone") as string;
  const fullName = formData.get("full_name") as string;

  if (!email || !password || !agencyName || !city) {
    return { error: "Tous les champs obligatoires doivent être remplis." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || agencyName,
        agency_name: agencyName,
        city,
        phone,
        role: "admin",
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Un compte existe déjà avec cette adresse email." };
    }
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Sign in with email + password.
 */
export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login")) {
      return { error: "Email ou mot de passe incorrect." };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Get the current authenticated user and their profile.
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*, tenant:tenants(*)")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile,
  };
}
