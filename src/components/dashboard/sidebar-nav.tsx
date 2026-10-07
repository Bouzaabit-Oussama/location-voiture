"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  Users,
  ClipboardCheck,
  FileText,
  Settings,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SidebarNavProps {
  isSuperAdmin?: boolean;
}

export function SidebarNav({ isSuperAdmin }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      labelAr: "لوحة القيادة",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: "/dashboard/fleet",
      label: "Flotte de véhicules",
      labelAr: "الأسطول",
      icon: Car,
      badge: null,
    },
    {
      href: "/dashboard/bookings",
      label: "Réservations",
      labelAr: "الحجوزات",
      icon: CalendarDays,
      badge: null,
    },
    {
      href: "/dashboard/clients",
      label: "Clients & Conducteurs",
      labelAr: "العملاء",
      icon: Users,
      badge: null,
    },
    {
      href: "/dashboard/inspections",
      label: "États des lieux (PWA)",
      labelAr: "المعاينات",
      icon: ClipboardCheck,
      badge: "Offline",
    },
    {
      href: "/dashboard/legal",
      label: "Infractions & CNDP",
      labelAr: "القانونية",
      icon: FileText,
      badge: "DGSN",
    },
    {
      href: "/dashboard/settings",
      label: "Configuration agence",
      labelAr: "الإعدادات",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
      <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Menu Principal
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-semibold"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                }`}
              />
              <span>{item.label}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {item.badge && (
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className={`text-[9px] px-1.5 py-0 h-4 ${isActive ? "bg-white/20 text-white hover:bg-white/20" : "text-slate-400 border-slate-700/60"}`}
                >
                  {item.badge}
                </Badge>
              )}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </div>
          </Link>
        );
      })}

      {isSuperAdmin && (
        <div className="pt-5 mt-4 border-t border-slate-800/80">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administration SaaS</span>
          </div>
          <Link
            href="/admin"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Portail SuperAdmin</span>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400/60" />
          </Link>
        </div>
      )}
    </nav>
  );
}
