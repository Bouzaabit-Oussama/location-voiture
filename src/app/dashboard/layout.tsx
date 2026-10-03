import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { TopBar } from "@/components/dashboard/top-bar";
import { APP_VERSION } from "@/lib/version";
import { Car, Building2, Sparkles } from "lucide-react";

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex antialiased">
        {/* Sidebar */}
        <aside
          className="sidebar hidden lg:flex flex-col w-64 fixed inset-y-0 z-30 bg-slate-900 border-r border-slate-800 shadow-2xl transition-all"
        >
          {/* Logo Header */}
          <div className="px-6 py-5 border-b border-slate-800/80">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base bg-gradient-to-br from-blue-500 via-indigo-600 to-amber-500 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                LV
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-white tracking-tight">
                    Location<span className="text-amber-400">Voiture</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                    v{APP_VERSION}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Maroc
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <SidebarNav isSuperAdmin={tenant?.is_superadmin} />

          {/* Footer User & Tenant Info */}
          <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
            {/* Tenant Card */}
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{tenant?.name || "Mon Agence"}</span>
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {tenant?.city || "Maroc"} • Plan Pro
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Système opérationnel" />
            </div>

            {/* User Profile Card */}
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {profile.full_name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize truncate">
                    {profile.role === "admin" ? "Administrateur" : profile.role}
                  </p>
                </div>
              </div>
              <SignOutButton />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
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

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}
