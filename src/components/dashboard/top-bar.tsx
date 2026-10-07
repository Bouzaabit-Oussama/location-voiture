"use client";

import Link from "next/link";
import { Search, Bell, Plus, Calendar, LogOut, Settings, User } from "lucide-react";
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
    <header className="h-16 shrink-0 bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20">
      {/* Left: Date indicator + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 shrink-0 font-medium">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{formattedDate}</span>
        </div>

        <div className="hidden xl:block h-4 w-px bg-slate-800" />

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Rechercher véhicule, immatriculation, contrat, client..."
            className="w-full pl-9 pr-12 h-9 bg-slate-900/80 border-slate-800 focus-visible:ring-1 focus-visible:ring-blue-500/50"
          />
          <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-muted-foreground bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right: Actions & User pill */}
      <div className="flex items-center gap-3">
        {/* Quick New Contract Action */}
        <Link
          href="/dashboard/bookings"
          className={buttonVariants({
            size: "sm",
            className: "bg-blue-600 hover:bg-blue-500 text-white font-semibold hidden sm:flex items-center",
          })}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nouveau contrat
        </Link>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-slate-200">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
        </Button>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none focus:outline-none">
            <div className="h-auto p-1 pl-2 pr-3 hover:bg-slate-900 flex items-center gap-2.5 rounded-full cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                {user.initials}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-200 leading-tight">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  {tenant.name}
                  {tenant.isSuperAdmin && (
                    <Badge variant="outline" className="text-[9px] h-3.5 px-1 py-0 bg-amber-500/10 text-amber-500 border-amber-500/20">
                      ADMIN
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-950 border-slate-800">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-slate-200">{user.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="focus:bg-slate-900 cursor-pointer p-0">
              <Link href="/dashboard/settings" className="flex items-center w-full px-2 py-1.5">
                <User className="w-4 h-4 mr-2" />
                <span>Mon Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-900 cursor-pointer p-0">
              <Link href="/dashboard/settings" className="flex items-center w-full px-2 py-1.5">
                <Settings className="w-4 h-4 mr-2" />
                <span>Paramètres Agence</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
