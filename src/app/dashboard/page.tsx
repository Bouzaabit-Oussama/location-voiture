import Link from "next/link";
import {
  Car,
  CalendarCheck2,
  Banknote,
  TrendingUp,
  Plus,
  Users,
  ClipboardCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Véhicules en flotte",
      value: "14",
      subtext: "12 disponibles immédiatement",
      change: "+2 ce mois",
      trend: "up",
      icon: Car,
      color: "from-blue-600 to-indigo-600",
      lightColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Contrats actifs",
      value: "8",
      subtext: "3 retours attendus aujourd'hui",
      change: "+15%",
      trend: "up",
      icon: CalendarCheck2,
      color: "from-emerald-600 to-teal-600",
      lightColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Chiffre d'affaires (Mois)",
      value: "42 800 MAD",
      subtext: "Objectif mensuel à 85%",
      change: "+12.4%",
      trend: "up",
      icon: Banknote,
      color: "from-amber-500 to-orange-600",
      lightColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Taux d'occupation",
      value: "78%",
      subtext: "Période touristique MRE",
      change: "Optimal",
      trend: "neutral",
      icon: TrendingUp,
      color: "from-purple-600 to-pink-600",
      lightColor: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plateforme Location Voiture Maroc</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Bonjour, bienvenue sur votre espace agence
            </h1>
            <p className="text-sm text-slate-300">
              Gérez vos réservations, vos véhicules et la conformité légale marocaine (contrats bilingues, DGSN et CNDP) en temps réel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau contrat</span>
            </Link>
            <Link
              href="/dashboard/fleet"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-105"
            >
              <Car className="w-4 h-4" />
              <span>Ajouter un véhicule</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.lightColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {stat.change}
                </span>
              </div>

              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {stat.label}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{stat.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Fast Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Opérations directes
              </h2>
              <span className="text-xs text-slate-400">Raccourcis rapides</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Réservation", href: "/dashboard/bookings", icon: CalendarCheck2, desc: "Émettre contrat" },
                { label: "Véhicule", href: "/dashboard/fleet", icon: Car, desc: "Ajouter flotte" },
                { label: "Nouveau Client", href: "/dashboard/clients", icon: Users, desc: "Scan CIN / Permis" },
                { label: "État des lieux", href: "/dashboard/inspections", icon: ClipboardCheck, desc: "Check-in digital" },
              ].map((act, idx) => {
                const Icon = act.icon;
                return (
                  <Link
                    key={idx}
                    href={act.href}
                    className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-all group text-left"
                  >
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-2">
                      {act.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {act.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Operations List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Contrats et départs récents
              </h2>
              <Link
                href="/dashboard/bookings"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Voir tout</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { ref: "LV-2026-9K12A", client: "Karim Benjelloun", car: "Dacia Logan 2024", city: "Aéroport Tanger", dates: "03 Oct - 07 Oct", status: "En cours", amount: "1 400 MAD" },
                { ref: "LV-2026-3M88X", client: "Sarah El Mansouri", car: "Renault Clio 5", city: "Tanger Centre", dates: "02 Oct - 05 Oct", status: "En cours", amount: "1 200 MAD" },
                { ref: "LV-2026-7P44Q", client: "Youssef Tazi", car: "Hyundai Tucson", city: "Port Tanger Med", dates: "01 Oct - 08 Oct", status: "Confirmé", amount: "4 200 MAD" },
              ].map((row, idx) => (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                      LV
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{row.client}</span>
                        <span className="font-mono text-[10px] text-slate-400">{row.ref}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                        {row.car} • {row.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-slate-500 font-medium">{row.dates}</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{row.amount}</span>
                    <span className="px-2 py-0.5 rounded-full font-semibold text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fleet Health & Alerts */}
        <div className="space-y-6">
          {/* Moroccan Compliance Widget */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 border border-blue-800/60 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Conformité Réglementaire Maroc</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-300">Contrats DGSN & Fiches Police</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Conforme
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-300">Registre CNDP (Loi 09-08)</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Actif
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Gestion Amendes RADAR (NARSA)</span>
                <span className="text-blue-300 font-semibold">Automatisé</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              Vos documents légaux intègrent le consentement CNDP et l&apos;identification du conducteur selon le cahier des charges du Ministère du Transport.
            </p>
          </div>

          {/* Quick Fleet Health */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span>État de la flotte</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Véhicules sur la route</span>
                  <span className="text-blue-600 font-bold">8 / 14</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "57%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Disponibles au parc</span>
                  <span className="text-emerald-600 font-bold">5 / 14</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "35%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-300">En entretien / Révision</span>
                  <span className="text-amber-600 font-bold">1 / 14</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "8%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
