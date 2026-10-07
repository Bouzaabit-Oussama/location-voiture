import Link from "next/link";
import { APP_VERSION } from "@/lib/version";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Car,
  CalendarCheck2,
  Smartphone,
  FileText,
  ShieldCheck,
  BarChart3,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Car,
      tag: "Flotte",
      title: "Gestion de flotte intelligente",
      description: "Suivi en temps réel, visites techniques, alertes assurances et vignettes. Règle stricte des 5 ans (Ministère du Transport).",
    },
    {
      icon: CalendarCheck2,
      tag: "Réservations",
      title: "Contrats & Tarifs dynamiques",
      description: "Moteur anti double-réservation, acompte, franchise et gestion des saisons MRE en Dirham Marocain (MAD).",
    },
    {
      icon: Smartphone,
      tag: "Terrain PWA",
      title: "États des lieux hors ligne",
      description: "Inspection tactile avec marquage des rayures et signature numérique directe sur tablette ou smartphone.",
    },
    {
      icon: FileText,
      tag: "Légal & DGSN",
      title: "Fiches de Police & BiDi FR/AR",
      description: "Export instantané des fiches de renseignements touristiques pour la DGSN et contrats bilingues conformes.",
    },
    {
      icon: ShieldCheck,
      tag: "CNDP Loi 09-08",
      title: "Sécurité & Hachage CIN",
      description: "Chiffrement et hachage SHA-256 des pièces d'identité garantissant la stricte conformité aux données personnelles.",
    },
    {
      icon: BarChart3,
      tag: "Radar & NARSA",
      title: "Contentieux Infractions",
      description: "Attribution automatique des radars aux locataires et génération immédiate des lettres de décharge NARSA.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white antialiased selection:bg-[#0a84ff]/30 selection:text-white">
      {/* Apple Frosted Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-black/75 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform duration-200">
                LV
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-white">
                  Location<span className="text-amber-400">Voiture</span>
                </span>
                <span className="text-[10px] text-white/40 font-mono -mt-0.5">v{APP_VERSION}</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4 text-xs font-medium active:scale-95 transition-all",
                })}
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  size: "sm",
                  className: "bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-full px-4 text-xs font-medium shadow-sm active:scale-95 transition-all",
                })}
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-36 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          {/* Subtle Cupertino Radial Backlight */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-[#0a84ff]/15 blur-[140px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-medium text-white/80 backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
              <span>Conforme Réglementation Ministère du Transport & CNDP</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
              L'excellence logicielle pour la location de véhicules au Maroc.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-white/60 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
              Flotte, contrats, fiches de police DGSN, états des lieux tactiles et contentieux NARSA. Une expérience unifiée conçue avec la rigueur d'Apple.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6">
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "h-12 px-7 text-sm font-semibold bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-full shadow-lg shadow-blue-500/25 active:scale-95 transition-all w-full sm:w-auto inline-flex items-center justify-center",
                })}
              >
                Démarrer l'essai agence
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "h-12 px-7 text-sm font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10 rounded-full active:scale-95 transition-all w-full sm:w-auto",
                })}
              >
                Découvrir la suite
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid with Apple Cards */}
        <section id="features" className="py-20 sm:py-28 bg-[#0a0a0c] border-t border-white/[0.08] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-3">
              <p className="text-xs font-semibold text-[#0a84ff] uppercase tracking-wider">
                Fonctionnalités Métier
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Tout ce que le métier exige, sans compromis.
              </h2>
              <p className="text-sm sm:text-base text-white/60">
                Chaque module est pensé pour la productivité immédiate des gérants et agents de comptoir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="p-7 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] hover:border-white/20 transition-all duration-200 group flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#0a84ff] group-hover:scale-105 transition-transform duration-200">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-medium text-white/40 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                          {feature.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed font-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Apple Showcase Card Banner */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-white/10 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 to-transparent pointer-events-none" />
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Rejoignez les agences modernes au Maroc
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto mb-8">
              Démarrez en quelques secondes. Aucune carte bancaire requise. Accès complet au tableau de bord.
            </p>
            <Link
              href="/register"
              className={buttonVariants({
                size: "lg",
                className: "h-12 px-8 text-sm font-semibold bg-white text-black hover:bg-white/90 rounded-full shadow-lg active:scale-95 transition-all inline-flex items-center",
              })}
            >
              Créer mon compte agence
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </section>
      </main>

      {/* Apple Footer */}
      <footer className="border-t border-white/[0.08] bg-black py-10 px-4 sm:px-6 lg:px-8 text-xs text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
              LV
            </div>
            <span>© 2026 Location Voiture Maroc. Conforme CNDP & Transport Marocain.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Conditions Générales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
