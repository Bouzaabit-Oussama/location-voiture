import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { TopBar } from "@/components/dashboard/top-bar";
import { APP_VERSION } from "@/lib/version";
import { Building2 } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.profile) {
    redirect("/login");
  }

  const { profile } = currentUser;
  const tenant = profile.tenant;

  const userInitials = (profile.full_name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <TenantProvider initialTenant={tenant} initialProfile={profile}>
      <div className="flex h-screen overflow-hidden bg-[#09090b] text-[#fafafa] antialiased selection:bg-blue-500/30 selection:text-white">
        {/* ─── Sidebar (Desktop) ─── */}
        <aside className="w-[260px] shrink-0 hidden lg:flex flex-col h-full border-r border-white/[0.06] z-10 bg-[#0c0c0e]">
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-white/[0.06] flex items-center">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_2px_8px_rgba(59,130,246,0.3)] group-hover:shadow-[0_2px_12px_rgba(59,130,246,0.4)] transition-shadow duration-200">
                LV
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#fafafa] tracking-tight leading-none">
                  Location<span className="text-blue-400">Voiture</span>
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-[#71717a] font-mono">
                    v{APP_VERSION}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 leading-none">
                    Maroc
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-2">
            <SidebarNav isSuperAdmin={tenant?.is_superadmin} />
          </div>

          {/* Bottom Panel */}
          <div className="p-3 border-t border-white/[0.06] space-y-2">
            {/* Agency Badge */}
            <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-[#fafafa] truncate flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{tenant?.name || "Mon Agence"}</span>
                </p>
                <p className="text-[11px] text-[#71717a] truncate mt-0.5 pl-5">
                  {tenant?.city || "Maroc"} • Plan Pro
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0 shadow-[0_0_6px_rgba(34,197,94,0.4)]" title="En ligne" />
            </div>

            {/* User Row */}
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#fafafa] truncate">
                    {profile.full_name}
                  </p>
                  <p className="text-[10px] text-[#71717a] capitalize truncate">
                    {profile.role === "admin" ? "Administrateur" : profile.role}
                  </p>
                </div>
              </div>
              <SignOutButton />
            </div>
          </div>
        </aside>

        {/* ─── Main Content Area ─── */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          <TopBar
            user={{
              fullName: profile.full_name,
              email: profile.email,
              role: profile.role,
              initials: userInitials,
            }}
            tenant={{
              name: tenant?.name || "Mon Agence",
              city: tenant?.city || "Maroc",
              isSuperAdmin: tenant?.is_superadmin,
            }}
          />

          {/* Content Viewport */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#09090b]">
            <div className="max-w-[1400px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}
