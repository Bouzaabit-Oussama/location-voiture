"use client";

import Link from "next/link";
import { Search, Bell, Plus, Sparkles, Building2, ShieldCheck } from "lucide-react";

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
  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Search input */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher contrat, véhicule, matricule, client..."
              className="w-full pl-10 pr-12 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 shadow-xs">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-3">
          {/* Quick Booking Button */}
          <Link
            href="/dashboard/bookings"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau contrat</span>
          </Link>

          {/* Notifications */}
          <button
            className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* User & Agency Badge */}
          <div className="flex items-center gap-3 pl-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/20 ring-2 ring-white dark:ring-slate-800">
              {user.initials}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                {user.fullName}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {tenant.name}
                {tenant.isSuperAdmin && (
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    SUPERADMIN
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
