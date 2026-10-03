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
  ChevronRight,
  ShieldCheck,
  FileText,
  ArrowUpRight
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Véhicules en flotte",
      value: "14",
      subtext: "11 disponibles • 3 en location",
      change: "+2 ce mois",
      icon: Car,
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Contrats actifs",
      value: "8",
      subtext: "2 retours prévus aujourd'hui",
      change: "+15%",
      icon: CalendarCheck2,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Chiffre d'affaires (Mois)",
      value: "42 800 MAD",
      subtext: "Encaissé: 38 400 MAD",
      change: "+12.4%",
      icon: Banknote,
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Taux de rotation",
      value: "78%",
      subtext: "Période active",
      change: "Optimal",
      icon: TrendingUp,
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
  ];

  const recentRentals = [
    {
      ref: "LV-2026-9K12A",
      client: "Karim Benjelloun",
      phone: "+212 661-482910",
      car: "Dacia Logan 2024",
      plate: "28419 | أ | 1",
      period: "03 Oct - 07 Oct (4 j)",
      amount: "1 400 MAD",
      status: "En cours",
      statusClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      ref: "LV-2026-3M88X",
      client: "Sarah El Mansouri",
      phone: "+212 662-198450",
      car: "Renault Clio 5",
      plate: "49201 | د | 1",
      period: "02 Oct - 05 Oct (3 j)",
      amount: "1 200 MAD",
      status: "En cours",
      statusClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      ref: "LV-2026-7P44Q",
      client: "Youssef Tazi",
      phone: "+212 663-718290",
      car: "Hyundai Tucson",
      plate: "10934 | ب | 1",
      period: "01 Oct - 08 Oct (7 j)",
      amount: "4 200 MAD",
      status: "Confirmé",
      statusClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      ref: "LV-2026-1R05K",
      client: "Amine Chraibi",
      phone: "+212 664-901234",
      car: "Peugeot 208",
      plate: "33890 | أ | 1",
      period: "28 Sep - 02 Oct (4 j)",
      amount: "1 600 MAD",
      status: "Terminé",
      statusClass: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Supervision de la flotte, réservations et gestion des contrats
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une réservation</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-[#111726] rounded-xl p-4 border border-slate-800/80 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg border ${stat.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-slate-400">{stat.subtext}</span>
                  <span className="font-semibold text-emerald-400">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content: Left (2 Cols) + Right (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Activity Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111726] rounded-xl border border-slate-800/80 overflow-hidden shadow-xs">
            {/* Table Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">
                  Contrats de location récents
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mouvements et sorties en cours d&apos;exploitation
                </p>
              </div>

              <Link
                href="/dashboard/bookings"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>Voir tout</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Rentals Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-400 font-semibold bg-slate-900/40">
                    <th className="py-2.5 px-4">Contrat</th>
                    <th className="py-2.5 px-4">Client</th>
                    <th className="py-2.5 px-4">Véhicule</th>
                    <th className="py-2.5 px-4">Période</th>
                    <th className="py-2.5 px-4">Montant</th>
                    <th className="py-2.5 px-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentRentals.map((r, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-200">
                        {r.ref}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{r.client}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {r.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-medium">{r.car}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {r.plate}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{r.period}</td>
                      <td className="py-3 px-4 font-bold text-white">
                        {r.amount}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${r.statusClass}`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Quick actions & Compliance */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-[#111726] rounded-xl p-4 border border-slate-800/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
              Actions rapides
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard/bookings"
                className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
              >
                <CalendarCheck2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-slate-200 mt-2">
                  Réservation
                </span>
                <span className="text-[10px] text-slate-400">Nouveau contrat</span>
              </Link>

              <Link
                href="/dashboard/fleet"
                className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
              >
                <Car className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200 mt-2">
                  Véhicule
                </span>
                <span className="text-[10px] text-slate-400">Ajout au parc</span>
              </Link>

              <Link
                href="/dashboard/clients"
                className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-slate-200 mt-2">
                  Client
                </span>
                <span className="text-[10px] text-slate-400">CIN & Permis</span>
              </Link>

              <Link
                href="/dashboard/inspections"
                className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
              >
                <ClipboardCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200 mt-2">
                  État des lieux
                </span>
                <span className="text-[10px] text-slate-400">PWA Offline</span>
              </Link>
            </div>
          </div>

          {/* Maintenance & Due Alerts */}
          <div className="bg-[#111726] rounded-xl p-4 border border-slate-800/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Alertes & Échéances
              </h3>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                2 à surveiller
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">
                    Visite technique dans 14 jours
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Dacia Logan • Immat: 28419 | أ | 1
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">
                    Vidange moteur recommandée
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Renault Clio 5 • À 45 000 km (dans 600 km)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Moroccan Regulatory Compliance */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Conformité Légale Marocaine</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Vos contrats respectent les normes CNDP (Loi 09-08) et génèrent automatiquement la fiche de renseignement police (DGSN) ainsi que les avis d&apos;infraction NARSA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
