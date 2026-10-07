import Link from "next/link";
import {
  Car,
  CalendarCheck2,
  Banknote,
  TrendingUp,
  Plus,
  Users,
  ClipboardCheck,
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = [
    {
      label: "Véhicules en flotte",
      value: "14",
      subtext: "11 disponibles • 3 en sortie",
      change: "+2",
      changeLabel: "ce mois",
      trend: "up",
      icon: Car,
      accentColor: "#3b82f6",
    },
    {
      label: "Contrats actifs",
      value: "8",
      subtext: "2 retours prévus ce jour",
      change: "+15%",
      changeLabel: "vs mois dernier",
      trend: "up",
      icon: CalendarCheck2,
      accentColor: "#22c55e",
    },
    {
      label: "Chiffre d'affaires",
      value: "42 800",
      unit: "MAD",
      subtext: "Encaissé: 38 400 MAD",
      change: "+12.4%",
      changeLabel: "vs mois dernier",
      trend: "up",
      icon: Banknote,
      accentColor: "#f59e0b",
    },
    {
      label: "Taux de rotation",
      value: "78%",
      subtext: "Parc actif",
      change: "Optimal",
      changeLabel: "",
      trend: "up",
      icon: TrendingUp,
      accentColor: "#8b5cf6",
    },
  ];

  const recentRentals = [
    {
      ref: "LV-2026-9K12A",
      client: "Karim Benjelloun",
      phone: "+212 661-482910",
      car: "Dacia Logan 2024",
      plate: "28419 | أ | 1",
      period: "03 Oct – 07 Oct",
      days: "4j",
      amount: "1 400 MAD",
      status: "En cours",
      statusColor: "#3b82f6",
    },
    {
      ref: "LV-2026-3M88X",
      client: "Sarah El Mansouri",
      phone: "+212 662-198450",
      car: "Renault Clio 5",
      plate: "49201 | د | 1",
      period: "02 Oct – 05 Oct",
      days: "3j",
      amount: "1 200 MAD",
      status: "En cours",
      statusColor: "#3b82f6",
    },
    {
      ref: "LV-2026-7P44Q",
      client: "Youssef Tazi",
      phone: "+212 663-718290",
      car: "Hyundai Tucson",
      plate: "71032 | هـ | 6",
      period: "28 Sep – 03 Oct",
      days: "5j",
      amount: "3 250 MAD",
      status: "Clôturé",
      statusColor: "#22c55e",
    },
  ];

  const quickActions = [
    {
      href: "/dashboard/bookings",
      icon: CalendarCheck2,
      label: "Réservation",
      sublabel: "Nouveau contrat",
      color: "#3b82f6",
    },
    {
      href: "/dashboard/fleet",
      icon: Car,
      label: "Véhicule",
      sublabel: "Ajout au parc",
      color: "#22c55e",
    },
    {
      href: "/dashboard/clients",
      icon: Users,
      label: "Client",
      sublabel: "Fiche & CIN",
      color: "#8b5cf6",
    },
    {
      href: "/dashboard/inspections",
      icon: ClipboardCheck,
      label: "État des lieux",
      sublabel: "PWA Offline",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="space-y-8 lx-animate-in">
      {/* ─── Page Header ─── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#fafafa]">
            Tableau de bord
          </h1>
          <p className="text-sm text-[#71717a] mt-1">
            Vue d'ensemble de votre activité et gestion opérationnelle
          </p>
        </div>
        <Link
          href="/dashboard/bookings"
          className={buttonVariants({
            size: "sm",
            className:
              "bg-[#fafafa] hover:bg-white text-black font-semibold rounded-xl shadow-sm active:scale-[0.98] transition-all h-10 px-5",
          })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer une réservation
        </Link>
      </header>

      {/* ─── KPI Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lx-stagger">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="group relative p-6 rounded-2xl bg-[#131316] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
              style={{
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
              }}
            >
              {/* Subtle accent glow at top */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.accentColor}40, transparent)`,
                }}
              />

              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-medium text-[#a1a1aa] tracking-wide">
                  {stat.label}
                </span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${stat.accentColor}20, ${stat.accentColor}08)`,
                    border: `1px solid ${stat.accentColor}25`,
                  }}
                >
                  <Icon
                    className="w-[18px] h-[18px]"
                    style={{ color: stat.accentColor }}
                    strokeWidth={1.75}
                  />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-[#fafafa]">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-sm font-medium text-[#71717a]">
                    {stat.unit}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                <span className="text-xs text-[#71717a] truncate mr-2">
                  {stat.subtext}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-[#22c55e]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-[#ef4444]" />
                  )}
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color:
                        stat.trend === "up" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Recent Contracts Table */}
        <div className="xl:col-span-2">
          <div
            className="rounded-2xl bg-[#131316] border border-white/[0.08] overflow-hidden"
            style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
            }}
          >
            {/* Table Header */}
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#fafafa] tracking-tight">
                  Contrats récents
                </h2>
                <p className="text-xs text-[#71717a] mt-0.5">
                  Mouvements et sorties en cours
                </p>
              </div>
              <Link
                href="/dashboard/bookings"
                className="group/link flex items-center gap-1 text-xs font-medium text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
              >
                <span>Voir tout</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-t border-white/[0.06]">
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">
                      Contrat
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider hidden md:table-cell">
                      Véhicule
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider hidden lg:table-cell">
                      Période
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider text-right">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider text-right">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentRentals.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer group/row"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-medium text-[#a1a1aa]">
                          {r.ref}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#fafafa]">
                          {r.client}
                        </div>
                        <div className="text-[11px] text-[#71717a] font-mono mt-0.5">
                          {r.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-[#fafafa]">
                          {r.car}
                        </div>
                        <div className="text-[11px] text-[#71717a] mt-0.5">
                          {r.plate}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-[#a1a1aa]">
                          {r.period}
                        </div>
                        <div className="text-[11px] text-[#71717a] mt-0.5">
                          {r.days}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-[#fafafa]">
                          {r.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                          style={{
                            background: `${r.statusColor}12`,
                            color: r.statusColor,
                            border: `1px solid ${r.statusColor}25`,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: r.statusColor }}
                          />
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

        {/* Right Column: Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div
            className="p-6 rounded-2xl bg-[#131316] border border-white/[0.08]"
            style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#71717a] mb-4">
              Actions rapides
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={i}
                    href={action.href}
                    className="group/action p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200 active:scale-[0.98] flex flex-col gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover/action:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${action.color}18, ${action.color}08)`,
                        border: `1px solid ${action.color}20`,
                      }}
                    >
                      <Icon
                        className="w-[18px] h-[18px]"
                        style={{ color: action.color }}
                        strokeWidth={1.75}
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-[#fafafa]">
                        {action.label}
                      </span>
                      <span className="block text-[11px] text-[#71717a] mt-0.5">
                        {action.sublabel}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Alerts & Deadlines */}
          <div
            className="p-6 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4"
            style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#71717a]">
                Alertes & Échéances
              </h3>
              <span className="text-[11px] font-semibold text-[#f59e0b] bg-[#f59e0b]/10 px-2.5 py-1 rounded-full border border-[#f59e0b]/20">
                2 à surveiller
              </span>
            </div>

            {/* Alert Item */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle
                  className="w-4 h-4 text-[#f59e0b]"
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#fafafa]">
                  Visite technique dans 14 jours
                </p>
                <p className="text-[11px] text-[#71717a] mt-1">
                  Dacia Logan • Immat: 28419 | أ | 1
                </p>
              </div>
            </div>

            {/* Alert Item */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Clock
                  className="w-4 h-4 text-[#3b82f6]"
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#fafafa]">
                  Vidange moteur recommandée
                </p>
                <p className="text-[11px] text-[#71717a] mt-1">
                  Renault Clio 5 • À 45 000 km (dans 600 km)
                </p>
              </div>
            </div>
          </div>

          {/* Regulatory Compliance */}
          <div
            className="p-6 rounded-2xl border overflow-hidden relative"
            style={{
              background:
                "linear-gradient(135deg, rgba(34, 197, 94, 0.06), rgba(19, 19, 22, 1))",
              borderColor: "rgba(34, 197, 94, 0.15)",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(34, 197, 94, 0.05)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#22c55e]/15 flex items-center justify-center">
                <ShieldCheck
                  className="w-4 h-4 text-[#22c55e]"
                  strokeWidth={1.75}
                />
              </div>
              <span className="text-sm font-semibold text-[#22c55e]">
                Conformité Réglementaire
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed pl-[42px]">
              Protection des données Loi 09-08 (CNDP), fiches de police
              DGSN et décharges radars NARSA intégrées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
