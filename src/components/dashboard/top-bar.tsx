"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Plus, Calendar, LogOut, Settings, User, Menu, X, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { APP_VERSION } from "@/lib/version";

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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Format today's date in French
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <header className="h-16 shrink-0 lx-glass-nav border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20 sticky top-0">
        {/* Left: Mobile hamburger + Date indicator + Search */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
          {/* Mobile hamburger button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.06] -ml-1 rounded-xl h-9 w-9"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Date pill (Desktop) */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#71717a] shrink-0 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#3b82f6]" strokeWidth={1.75} />
            <span>{formattedDate}</span>
          </div>

          <div className="hidden xl:block h-4 w-px bg-white/[0.06]" />

          {/* Search bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a] pointer-events-none" />
            <Input
              type="text"
              placeholder="Rechercher véhicule, contrat..."
              className="w-full pl-9 pr-12 h-9 bg-[#131316] border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-[#fafafa] placeholder:text-[#4e4e56] text-sm shadow-sm transition-all"
            />
            <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-[#71717a] bg-white/[0.04] px-1.5 py-0.5 rounded-md border border-white/[0.08]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Actions & User pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick New Contract Action */}
          <Link
            href="/dashboard/bookings"
            className={buttonVariants({
              size: "sm",
              className: "bg-[#fafafa] hover:bg-white text-black font-semibold rounded-xl hidden sm:flex items-center shadow-sm active:scale-[0.98] transition-all h-9 px-4",
            })}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Nouveau contrat
          </Link>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.06] rounded-xl h-9 w-9 active:scale-[0.98] border border-transparent hover:border-white/[0.06] transition-all"
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[#ef4444] shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
          </Button>

          <div className="h-5 w-px bg-white/[0.08] mx-0.5 hidden sm:block" />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none focus:outline-none">
              <div className="h-9 p-1 pl-1 pr-3 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] flex items-center gap-2.5 rounded-full cursor-pointer transition-all active:scale-[0.98]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                  {user.initials}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#fafafa] leading-tight truncate max-w-[120px]">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-[#71717a] leading-none mt-0.5">
                    {tenant.name}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#131316] border-white/[0.08] shadow-2xl rounded-2xl p-1.5 backdrop-blur-3xl">
              <DropdownMenuLabel className="font-normal px-2.5 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-[#fafafa]">{user.fullName}</p>
                  <p className="text-xs leading-none text-[#71717a]">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
              <DropdownMenuItem className="focus:bg-white/[0.06] rounded-xl cursor-pointer p-0">
                <Link href="/dashboard/settings" className="flex items-center w-full px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]">
                  <User className="w-[18px] h-[18px] mr-2.5 text-[#71717a]" strokeWidth={1.75} />
                  <span>Mon Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/[0.06] rounded-xl cursor-pointer p-0">
                <Link href="/dashboard/settings" className="flex items-center w-full px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]">
                  <Settings className="w-[18px] h-[18px] mr-2.5 text-[#71717a]" strokeWidth={1.75} />
                  <span>Paramètres Agence</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-[#ef4444] focus:bg-[#ef4444]/10 focus:text-[#ef4444] rounded-xl cursor-pointer px-3 py-2 text-sm flex items-center"
              >
                <LogOut className="w-[18px] h-[18px] mr-2.5" strokeWidth={1.75} />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] h-full bg-[#0c0c0e] border-r border-white/[0.06] flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="h-16 px-5 border-b border-white/[0.06] flex items-center justify-between bg-[#0c0c0e]">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                  LV
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#fafafa] tracking-tight leading-none">
                    Location<span className="text-blue-400">Voiture</span>
                  </span>
                  <span className="text-[10px] text-[#71717a] font-mono mt-1">v{APP_VERSION}</span>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#71717a] hover:text-[#fafafa] hover:bg-white/[0.06] rounded-xl h-9 w-9 -mr-2"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </Button>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto bg-[#0c0c0e]">
              <SidebarNav
                isSuperAdmin={tenant.isSuperAdmin}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>

            {/* Bottom Agency bar */}
            <div className="p-4 border-t border-white/[0.06] space-y-3 bg-[#09090b]">
              <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium text-[#fafafa] truncate flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" strokeWidth={1.75} />
                    <span className="truncate">{tenant.name}</span>
                  </p>
                  <p className="text-[11px] text-[#71717a] truncate mt-0.5 pl-5">
                    {tenant.city} • Plan Pro
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
              </div>

              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start text-[#ef4444] hover:bg-[#ef4444]/10 hover:text-[#ef4444] text-sm h-10 px-3 rounded-xl transition-colors"
              >
                <LogOut className="w-[18px] h-[18px] mr-2.5" strokeWidth={1.75} />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
