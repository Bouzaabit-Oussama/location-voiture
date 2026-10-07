"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, AlertCircle } from "lucide-react";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#09090b] text-[#fafafa] antialiased selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] opacity-50 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/15 via-blue-600/5 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-[420px] relative z-10 lx-animate-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-5 shadow-[0_4px_16px_rgba(59,130,246,0.3)] group-hover:shadow-[0_4px_24px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-all duration-200">
              LV
            </div>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[#fafafa]">
            Connexion Agence
          </h1>
          <p className="text-sm text-[#71717a] mt-1.5">
            Accédez à la gestion de votre flotte et de vos contrats
          </p>
        </div>

        {/* Card Container */}
        <div
          className="p-8 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-6"
          style={{
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)",
          }}
        >
          {/* Error Alert */}
          {state.error && (
            <div className="p-3.5 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-xs text-[#ef4444]">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-[#a1a1aa]">
                Adresse email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nom@agence.ma"
                className="bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-[#fafafa] placeholder:text-[#4e4e56] text-sm h-11 transition-all"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-[#a1a1aa]">
                  Mot de passe
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-medium text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                >
                  Oublié ?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-[#fafafa] placeholder:text-[#4e4e56] text-sm h-11 transition-all"
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-sm font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(59,130,246,0.5),0_0_16px_rgba(59,130,246,0.1)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours…
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="pt-4 text-center border-t border-white/[0.06]">
            <p className="text-sm text-[#71717a]">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="text-[#3b82f6] font-medium hover:text-[#60a5fa] transition-colors"
              >
                Créer une agence
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-[#4e4e56] mt-8">
          <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Conforme CNDP Loi 09-08 • Chiffrement de bout en bout</span>
        </div>
      </div>
    </div>
  );
}
