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
      {/* 
        Bulletproof Flex Layout:
        - Parent has h-screen overflow-hidden.
        - Sidebar is a normal flex child with w-64 shrink-0.
        - Main content is flex-1 min-w-0 overflow-y-auto.
        -> It is physically impossible for the sidebar to overlap the content.
      */}
      <div className="flex h-screen overflow-hidden bg-[#090D16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {/* Left Fixed Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col h-full bg-[#0D121F] border-r border-slate-800/80 z-10">
          {/* Logo Brand Header */}
          <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                LV
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight leading-none">
                  Location<span className="text-amber-400">Voiture</span>
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                    v{APP_VERSION}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Maroc
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <SidebarNav isSuperAdmin={tenant?.is_superadmin} />
          </div>

          {/* Bottom Agency & Profile Bar */}
          <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#090D16]/60">
            {/* Agency Badge */}
            <div className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{tenant?.name || "Mon Agence"}</span>
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {tenant?.city || "Maroc"} • Plan Pro
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="En ligne" />
            </div>

            {/* User row */}
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
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

        {/* Right Main Content Column */}
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

          {/* Scrollable Viewport */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}
