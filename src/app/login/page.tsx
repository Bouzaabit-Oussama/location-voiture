"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-white antialiased selection:bg-[#0a84ff]/30 selection:text-white relative overflow-hidden">
      {/* Cupertino Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0a84ff]/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in duration-300">
        {/* Apple ID Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              LV
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Connexion Agence
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Accédez à la gestion de votre flotte et de vos contrats
          </p>
        </div>

        {/* Apple Card Container */}
        <div className="p-7 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] shadow-2xl backdrop-blur-2xl space-y-5">
          {/* Error Alert */}
          {state.error && (
            <div className="p-3 rounded-xl bg-[#ff453a]/15 border border-[#ff453a]/25 text-[#ff453a] text-xs">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-white/70">
                Adresse email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nom@agence.ma"
                className="bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 text-xs h-10"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs text-white/70">
                  Mot de passe
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#0a84ff] hover:underline"
                >
                  Oublié ?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 text-xs h-10"
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-10 bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl text-xs font-semibold shadow-sm active:scale-[0.98] transition-all mt-2"
            >
              {isPending ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="pt-2 text-center border-t border-white/[0.06]">
            <p className="text-xs text-white/40">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="text-[#0a84ff] font-medium hover:underline"
              >
                Créer une agence
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-white/30 mt-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Conforme CNDP Loi 09-08 • Chiffrement de bout en bout</span>
        </div>
      </div>
    </div>
  );
}
