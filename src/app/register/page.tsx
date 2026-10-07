"use client";

import { useActionState } from "react";
import { signUp, type AuthState } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, MailCheck } from "lucide-react";

const initialState: AuthState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  // Success state — email confirmation sent
  if (state.success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black text-white antialiased selection:bg-[#0a84ff]/30 selection:text-white relative overflow-hidden">
        <div className="w-full max-w-md relative z-10 animate-in fade-in duration-300 text-center">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] shadow-2xl backdrop-blur-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0a84ff]/15 flex items-center justify-center mx-auto text-[#0a84ff]">
              <MailCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Vérifiez votre boîte email
            </h1>
            <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
              Un lien de confirmation a été envoyé à votre adresse email.
              Cliquez dessus pour activer votre compte agence.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full h-10 bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl text-xs font-semibold active:scale-[0.98] transition-all"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-black text-white antialiased selection:bg-[#0a84ff]/30 selection:text-white relative overflow-hidden">
      {/* Cupertino Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#0a84ff]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in duration-300">
        {/* Apple ID Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              LV
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Créer votre agence
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Démarrez la gestion de votre flotte et de vos contrats au Maroc
          </p>
        </div>

        {/* Apple Card Container */}
        <div className="p-7 sm:p-9 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] shadow-2xl backdrop-blur-2xl space-y-5">
          {/* Error Alert */}
          {state.error && (
            <div className="p-3 rounded-xl bg-[#ff453a]/15 border border-[#ff453a]/25 text-[#ff453a] text-xs">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-xs text-white/70">
                  Votre nom complet
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Mohammed Alaoui"
                  className="bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 text-xs h-10"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="agency_name" className="text-xs text-white/70">
                  Nom de l'agence
                </Label>
                <Input
                  id="agency_name"
                  name="agency_name"
                  type="text"
                  placeholder="Ex: Atlas Car Rental"
                  className="bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 text-xs h-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-xs text-white/70">
                  Ville principale
                </Label>
                <select
                  id="city"
                  name="city"
                  className="w-full h-10 px-3 bg-[#242426] border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-2 focus:ring-[#0a84ff]/50"
                  required
                >
                  <option value="">Sélectionnez...</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Fès">Fès</option>
                  <option value="Oujda">Oujda</option>
                  <option value="Nador">Nador</option>
                  <option value="Meknès">Meknès</option>
                  <option value="Tétouan">Tétouan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs text-white/70">
                  Téléphone agence
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  className="bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 text-xs h-10"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-white/70">
                Email professionnel
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@votre-agence.ma"
                className="bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 text-xs h-10"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-white/70">
                Mot de passe (8 car. min)
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 caractères"
                className="bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 text-xs h-10"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="cndp_consent"
                name="cndp_consent"
                className="mt-0.5 rounded border-white/20 bg-white/10 text-[#0a84ff] focus:ring-[#0a84ff]"
                required
              />
              <label
                htmlFor="cndp_consent"
                className="text-[11px] text-white/50 leading-relaxed cursor-pointer"
              >
                J'accepte les conditions d'utilisation et je consens au traitement de mes données conformément à la Loi 09-08 (CNDP).
              </label>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-10 bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl text-xs font-semibold shadow-sm active:scale-[0.98] transition-all mt-2"
            >
              {isPending ? "Création en cours..." : "Créer mon agence — Essai gratuit"}
            </Button>
          </form>

          <div className="pt-2 text-center border-t border-white/[0.06]">
            <p className="text-xs text-white/40">
              Déjà inscrit ?{" "}
              <Link
                href="/login"
                className="text-[#0a84ff] font-medium hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-white/30 mt-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protection des données Loi 09-08 (CNDP) • Conforme Ministère du Transport</span>
        </div>
      </div>
    </div>
  );
}
