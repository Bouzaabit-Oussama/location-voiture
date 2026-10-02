import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Auth callback route — handles email confirmation redirect from Supabase.
 * Exchanges the auth code for a session and redirects to dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // After successful auth, provision tenant if first login
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user_profile already exists
        const { data: existingProfile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingProfile) {
          // First login — create tenant and user profile
          const metadata = user.user_metadata;

          // Create tenant
          const { data: tenant, error: tenantError } = await supabase
            .from("tenants")
            .insert({
              name: metadata.agency_name || "Mon Agence",
              slug: (metadata.agency_name || "agency")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
                + "-" + Date.now().toString(36),
              city: metadata.city || "Casablanca",
              phone: metadata.phone || "",
              email: user.email,
            })
            .select("id")
            .single();

          if (!tenantError && tenant) {
            // Create user profile linked to tenant
            await supabase.from("user_profiles").insert({
              id: user.id,
              tenant_id: tenant.id,
              email: user.email!,
              full_name: metadata.full_name || metadata.agency_name || "Admin",
              role: "admin",
              phone: metadata.phone || "",
            });
          }
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // If code is missing or exchange failed, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
