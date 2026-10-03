import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { APP_VERSION } from "@/lib/version";

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

  const navItems = [
    { href: "/dashboard", label: "Tableau de bord", labelAr: "لوحة القيادة", icon: "📊" },
    { href: "/dashboard/fleet", label: "Flotte", labelAr: "الأسطول", icon: "🚗" },
    { href: "/dashboard/bookings", label: "Réservations", labelAr: "الحجوزات", icon: "📅" },
    { href: "/dashboard/clients", label: "Clients", labelAr: "العملاء", icon: "👥" },
    { href: "/dashboard/inspections", label: "Inspections", labelAr: "المعاينات", icon: "📱" },
    { href: "/dashboard/legal", label: "Juridique", labelAr: "القانونية", icon: "📄" },
    { href: "/dashboard/settings", label: "Paramètres", labelAr: "الإعدادات", icon: "⚙️" },
  ];

  const userInitials = (profile.full_name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <TenantProvider initialTenant={tenant} initialProfile={profile}>
      <div className="min-h-screen flex" style={{ background: "var(--color-bg)" }}>
        {/* Sidebar */}
        <aside
          className="sidebar hidden lg:flex flex-col w-64 fixed inset-y-0 z-30"
          style={{
            background: "var(--color-bg-sidebar)",
            borderInlineEnd: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary-light), var(--color-accent))",
              }}
            >
              LV
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-tight">
                Location
                <span style={{ color: "var(--color-accent-light)" }}>Voiture</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider">v{APP_VERSION}</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User & Tenant Info */}
          <div className="px-3 mb-3 space-y-2">
            <div
              className="px-4 py-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <p className="text-xs font-medium text-white truncate">
                {tenant?.name || "Mon Agence"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {tenant?.city || ""} • Plan Gratuit
              </p>
            </div>

            <div className="flex items-center gap-3 px-4 py-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "var(--color-primary)" }}
              >
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {profile.full_name}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {profile.role === "admin" ? "Administrateur" : profile.role}
                </p>
              </div>
              <SignOutButton />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ms-64">
          {/* Top Bar */}
          <header
            className="sticky top-0 z-20 glass"
            style={{
              borderBottom: "1px solid var(--color-border)",
              padding: "0 1.5rem",
            }}
          >
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button className="lg:hidden btn btn-ghost" aria-label="Menu">
                ☰
              </button>

              <div className="flex-1" />

              {/* User menu */}
              <div className="flex items-center gap-3">
                <button
                  className="btn btn-ghost text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  🔔
                </button>
                <div className="hidden sm:flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {userInitials}
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {profile.full_name}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6 animate-fade-in">{children}</div>
        </main>
      </div>
    </TenantProvider>
  );
}
