"use client";

import { signOut } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
      title="Se déconnecter"
      aria-label="Se déconnecter"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
