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
  ChevronRight,
} from "lucide-react";

interface SidebarNavProps {
  isSuperAdmin?: boolean;
  onNavigate?: () => void;
}

export function SidebarNav({ isSuperAdmin, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: "/dashboard/fleet",
      label: "Flotte de véhicules",
      icon: Car,
      badge: null,
    },
    {
      href: "/dashboard/bookings",
      label: "Réservations",
      icon: CalendarDays,
      badge: null,
    },
    {
      href: "/dashboard/clients",
      label: "Clients & Conducteurs",
      icon: Users,
      badge: null,
    },
    {
      href: "/dashboard/inspections",
      label: "États des lieux",
      icon: ClipboardCheck,
      badge: "PWA",
    },
    {
      href: "/dashboard/legal",
      label: "Infractions & CNDP",
      icon: FileText,
      badge: "DGSN",
    },
    {
      href: "/dashboard/settings",
      label: "Configuration",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
      {/* Section Label */}
      <div className="px-3 pb-3 pt-1 text-[11px] font-semibold tracking-[0.15em] text-[#4e4e56] uppercase">
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
            onClick={onNavigate}
            className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 active:scale-[0.98] ${
              isActive
                ? "bg-white/[0.08] text-[#fafafa] font-semibold"
                : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.04]"
            }`}
          >
            {/* Active Left Indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
            )}

            <div className="flex items-center gap-3 pl-1">
              <Icon
                className={`w-[18px] h-[18px] transition-all duration-150 ${
                  isActive
                    ? "text-[#3b82f6]"
                    : "text-[#71717a] group-hover:text-[#a1a1aa]"
                }`}
                strokeWidth={isActive ? 2 : 1.75}
              />
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md leading-none ${
                  isActive
                    ? "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/20"
                    : "bg-white/[0.04] text-[#71717a] border border-white/[0.06]"
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}

      {/* Super Admin Section */}
      {isSuperAdmin && (
        <div className="pt-4 mt-4 border-t border-white/[0.06]">
          <div className="px-3 pb-3 text-[11px] font-semibold tracking-[0.15em] text-[#f59e0b]/60 uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3" strokeWidth={2} />
            <span>Administration SaaS</span>
          </div>
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-[#f59e0b] bg-[#f59e0b]/[0.06] hover:bg-[#f59e0b]/[0.10] border border-[#f59e0b]/15 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 pl-1">
              <ShieldAlert className="w-[18px] h-[18px] text-[#f59e0b]" strokeWidth={1.75} />
              <span>Portail SuperAdmin</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#f59e0b]/40" />
          </Link>
        </div>
      )}
    </nav>
  );
}
