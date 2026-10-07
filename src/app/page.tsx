import Link from "next/link";
import { APP_VERSION } from "@/lib/version";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  Car,
  CalendarCheck2,
  Smartphone,
  FileText,
  ShieldCheck,
  BarChart3,
  ChevronRight,
  Sparkles,
  Check,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Car,
      tag: "Flotte",
      title: "Gestion de flotte intelligente",
      description:
        "Suivi en temps réel, visites techniques, alertes assurances et vignettes. Règle stricte des 5 ans (Ministère du Transport).",
      color: "#3b82f6",
    },
    {
      icon: CalendarCheck2,
      tag: "Réservations",
      title: "Contrats & Tarifs dynamiques",
      description:
        "Moteur anti double-réservation, acompte, franchise et gestion des saisons MRE en Dirham Marocain (MAD).",
      color: "#22c55e",
    },
    {
      icon: Smartphone,
      tag: "Terrain PWA",
      title: "États des lieux hors ligne",
      description:
        "Inspection tactile avec marquage des rayures et signature numérique directe sur tablette ou smartphone.",
      color: "#f59e0b",
    },
    {
      icon: FileText,
      tag: "Légal & DGSN",
      title: "Fiches de Police & BiDi FR/AR",
      description:
        "Export instantané des fiches de renseignements touristiques pour la DGSN et contrats bilingues conformes.",
      color: "#8b5cf6",
    },
    {
      icon: ShieldCheck,
      tag: "CNDP Loi 09-08",
      title: "Sécurité & Hachage CIN",
      description:
        "Chiffrement et hachage SHA-256 des pièces d'identité garantissant la stricte conformité aux données personnelles.",
      color: "#0ea5e9",
    },
    {
      icon: BarChart3,
      tag: "Radar & NARSA",
      title: "Contentieux Infractions",
      description:
        "Attribution automatique des radars aux locataires et génération immédiate des lettres de décharge NARSA.",
      color: "#ef4444",
    },
  ];

  const benefits = [
    "Aucune carte bancaire requise",
    "Données hébergées au Maroc",
    "Support WhatsApp inclus",
    "Migration gratuite",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] antialiased selection:bg-blue-500/30 selection:text-white">
      {/* ─── Navigation ─── */}
      <nav className="sticky top-0 z-50 lx-glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-[0_2px_8px_rgba(59,130,246,0.3)] group-hover:shadow-[0_2px_12px_rgba(59,130,246,0.4)] transition-shadow">
                LV
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-[#fafafa]">
                  Location<span className="text-blue-400">Voiture</span>
                </span>
                <span className="text-[10px] text-[#71717a] font-mono -mt-0.5">
                  v{APP_VERSION}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className:
                    "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.06] rounded-xl px-4 text-xs font-medium active:scale-[0.98] transition-all",
                })}
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  size: "sm",
                  className:
                    "bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl px-4 text-xs font-medium shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_12px_rgba(59,130,246,0.15)] active:scale-[0.98] transition-all",
                })}
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-24 pb-28 sm:pt-36 sm:pb-40 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[500px] opacity-40 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-blue-600/5 to-transparent blur-[100px] rounded-full" />
          </div>

          {/* Grid Pattern (subtle) */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="max-w-5xl mx-auto relative z-10 space-y-8">
            {/* Compliance Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#a1a1aa] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" strokeWidth={2} />
              <span>
                Conforme Réglementation Ministère du Transport & CNDP
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.08]">
              <span className="lx-gradient-text">
                L&apos;excellence logicielle
              </span>{" "}
              pour la location de véhicules au Maroc.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#a1a1aa] max-w-2xl mx-auto font-normal leading-relaxed">
              Flotte, contrats, fiches de police DGSN, états des lieux tactiles
              et contentieux NARSA. Tout-en-un, conçu pour les agences
              marocaines.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-12 px-7 text-sm font-semibold bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_24px_rgba(59,130,246,0.2)] active:scale-[0.98] transition-all w-full sm:w-auto inline-flex items-center justify-center",
                })}
              >
                Démarrer l&apos;essai agence
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className:
                    "h-12 px-7 text-sm font-semibold bg-white/[0.03] hover:bg-white/[0.06] text-[#fafafa] border-white/[0.08] hover:border-white/[0.14] rounded-xl active:scale-[0.98] transition-all w-full sm:w-auto",
                })}
              >
                Découvrir la suite
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Feature Grid ─── */}
        <section
          id="features"
          className="py-24 sm:py-32 border-t border-white/[0.06] relative"
        >
          {/* Subtle section background shift */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-[#0a0a0e] to-[#09090b] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
              <p className="text-[11px] font-semibold text-[#3b82f6] uppercase tracking-[0.2em]">
                Fonctionnalités Métier
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-tight">
                Tout ce que le métier exige,{" "}
                <span className="lx-gradient-text">sans compromis.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#a1a1aa]">
                Chaque module est pensé pour la productivité immédiate des
                gérants et agents de comptoir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lx-stagger">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="group p-7 rounded-2xl bg-[#131316] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
                    style={{
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
                    }}
                  >
                    {/* Hover gradient glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(400px circle at 50% 0%, ${feature.color}08, transparent 70%)`,
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${feature.color}18, ${feature.color}08)`,
                            border: `1px solid ${feature.color}20`,
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: feature.color }}
                            strokeWidth={1.75}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-[#71717a] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                          {feature.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#fafafa] mb-2.5 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[#a1a1aa] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div
              className="p-10 sm:p-16 rounded-3xl text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #131316 0%, #0f1117 50%, #131316 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)",
              }}
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-4xl font-bold text-[#fafafa] mb-4 tracking-tight">
                  Rejoignez les agences modernes au Maroc
                </h2>
                <p className="text-sm sm:text-base text-[#a1a1aa] max-w-xl mx-auto mb-8">
                  Démarrez en quelques secondes. Accès complet au tableau de
                  bord.
                </p>

                {/* Benefits List */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
                  {benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-[#a1a1aa]"
                    >
                      <Check className="w-4 h-4 text-[#22c55e]" strokeWidth={2} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/register"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "h-12 px-8 text-sm font-semibold bg-white text-[#09090b] hover:bg-white/90 rounded-xl shadow-[0_2px_16px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all inline-flex items-center",
                  })}
                >
                  Créer mon compte agence
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/[0.06] py-10 px-4 sm:px-6 lg:px-8 text-xs text-[#71717a]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-[9px]">
              LV
            </div>
            <span>
              © 2026 Location Voiture Maroc. Conforme CNDP & Transport
              Marocain.
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-[#fafafa] transition-colors"
            >
              Conditions Générales
            </a>
            <a
              href="#"
              className="hover:text-[#fafafa] transition-colors"
            >
              Confidentialité
            </a>
            <a
              href="#"
              className="hover:text-[#fafafa] transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
