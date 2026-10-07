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
      <header className="h-16 shrink-0 bg-black/80 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20 sticky top-0">
        {/* Left: Mobile hamburger + Date indicator + Search */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
          {/* Mobile hamburger button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-white/80 hover:text-white hover:bg-white/10 -ml-1 rounded-xl h-9 w-9"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Date pill (Desktop) */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-white/50 shrink-0 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#0a84ff]" />
            <span>{formattedDate}</span>
          </div>

          <div className="hidden xl:block h-4 w-px bg-white/10" />

          {/* Search bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            <Input
              type="text"
              placeholder="Rechercher véhicule, immatriculation, contrat, client..."
              className="w-full pl-9 pr-12 h-9 bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-[#0a84ff]/50 focus-visible:border-[#0a84ff]"
            />
            <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-white/40 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
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
              className: "bg-[#0a84ff] hover:bg-[#0071e3] text-white font-medium rounded-xl hidden sm:flex items-center shadow-xs active:scale-[0.98] transition-all",
            })}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Nouveau contrat
          </Link>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-9 w-9 active:scale-[0.98]"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#30d158] ring-2 ring-black" />
          </Button>

          <div className="h-5 w-px bg-white/10 mx-0.5 hidden sm:block" />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none focus:outline-none">
              <div className="h-auto p-1 pl-1.5 pr-2 sm:pr-3 hover:bg-white/[0.06] border border-transparent hover:border-white/10 flex items-center gap-2 sm:gap-2.5 rounded-full cursor-pointer transition-all active:scale-[0.98]">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {user.initials}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white/95 leading-tight">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-white/50 flex items-center gap-1">
                    {tenant.name}
                    {tenant.isSuperAdmin && (
                      <Badge variant="outline" className="text-[9px] h-3.5 px-1 py-0 bg-amber-500/10 text-amber-400 border-amber-500/20">
                        ADMIN
                      </Badge>
                    )}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1c1c1e] border-white/10 shadow-2xl rounded-2xl p-1.5 backdrop-blur-2xl">
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold leading-none text-white">{user.fullName}</p>
                  <p className="text-xs leading-none text-white/50">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10 my-1" />
              <DropdownMenuItem className="focus:bg-white/10 rounded-xl cursor-pointer p-0">
                <Link href="/dashboard/settings" className="flex items-center w-full px-2.5 py-2 text-sm text-white/80 hover:text-white">
                  <User className="w-4 h-4 mr-2 text-white/60" />
                  <span>Mon Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/10 rounded-xl cursor-pointer p-0">
                <Link href="/dashboard/settings" className="flex items-center w-full px-2.5 py-2 text-sm text-white/80 hover:text-white">
                  <Settings className="w-4 h-4 mr-2 text-white/60" />
                  <span>Paramètres Agence</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10 my-1" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-[#ff453a] focus:bg-red-500/10 focus:text-red-400 rounded-xl cursor-pointer px-2.5 py-2 text-sm flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Apple Drawer / Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] h-full bg-[#121214]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-sm">
                  LV
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-tight">
                    Location<span className="text-amber-400">Voiture</span>
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">v{APP_VERSION}</span>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto">
              <SidebarNav
                isSuperAdmin={tenant.isSuperAdmin}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>

            {/* Bottom Agency bar */}
            <div className="p-3 border-t border-white/10 space-y-2 bg-black/40">
              <div className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0a84ff] shrink-0" />
                    <span className="truncate">{tenant.name}</span>
                  </p>
                  <p className="text-[11px] text-white/40 truncate mt-0.5">
                    {tenant.city} • Plan Pro
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#30d158] shrink-0" />
              </div>

              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start text-[#ff453a] hover:bg-red-500/10 hover:text-red-400 text-xs h-8 px-2 rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
