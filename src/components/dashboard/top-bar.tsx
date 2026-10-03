"use client";

import Link from "next/link";
import { Search, Bell, Plus, Calendar, ShieldCheck } from "lucide-react";

interface TopBarProps {
  user: {
    fullName: string;
    email: string;
    role: string;
    initials: string;
  };
  tenant: {
    name: string;
    city: string;
    isSuperAdmin?: boolean;
  };
}

export function TopBar({ user, tenant }: TopBarProps) {
  // Format today's date in French
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <header className="h-16 shrink-0 bg-[#0D121F] border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20">
      {/* Left: Date indicator + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 shrink-0 font-medium">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{formattedDate}</span>
        </div>

        <div className="hidden xl:block h-4 w-px bg-slate-800" />

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher véhicule, immatriculation, contrat, client..."
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-900/80 text-slate-200 placeholder:text-slate-400 rounded-lg border border-slate-800 focus:border-blue-500 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono uppercase bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right: Actions & User pill */}
      <div className="flex items-center gap-3">
        {/* Quick New Contract Action */}
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau contrat</span>
        </Link>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0D121F]" />
        </button>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
            {user.initials}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-200 leading-tight">
              {user.fullName}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              {tenant.name}
              {tenant.isSuperAdmin && (
                <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20">
                  SUPERADMIN
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
