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
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const stats = [
    {
      label: "Véhicules en flotte",
      value: "14",
      subtext: "11 disponibles • 3 en sortie",
      change: "+2 ce mois",
      icon: Car,
      iconColor: "text-[#0a84ff]",
      bgClass: "bg-[#0a84ff]/10 border-[#0a84ff]/20",
    },
    {
      label: "Contrats actifs",
      value: "8",
      subtext: "2 retours prévus ce jour",
      change: "+15%",
      icon: CalendarCheck2,
      iconColor: "text-[#30d158]",
      bgClass: "bg-[#30d158]/10 border-[#30d158]/20",
    },
    {
      label: "Chiffre d'affaires",
      value: "42 800 MAD",
      subtext: "Encaissé: 38 400 MAD",
      change: "+12.4%",
      icon: Banknote,
      iconColor: "text-[#ffd60a]",
      bgClass: "bg-[#ffd60a]/10 border-[#ffd60a]/20",
    },
    {
      label: "Taux de rotation",
      value: "78%",
      subtext: "Parc actif",
      change: "Optimal",
      icon: TrendingUp,
      iconColor: "text-[#5e5ce6]",
      bgClass: "bg-[#5e5ce6]/10 border-[#5e5ce6]/20",
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
      statusClass: "bg-[#0a84ff]/15 text-[#0a84ff] border-[#0a84ff]/25",
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
      statusClass: "bg-[#0a84ff]/15 text-[#0a84ff] border-[#0a84ff]/25",
    },
    {
      ref: "LV-2026-7P44Q",
      client: "Youssef Tazi",
      phone: "+212 663-718290",
      car: "Hyundai Tucson",
      plate: "71032 | هـ | 6",
      period: "28 Sep - 03 Oct (5 j)",
      amount: "3 250 MAD",
      status: "Clôturé",
      statusClass: "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/25",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Tableau de bord
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Supervision de la flotte, mouvements et gestion opérationnelle
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/bookings"
            className={buttonVariants({
              size: "sm",
              className: "bg-[#0a84ff] hover:bg-[#0071e3] text-white font-medium rounded-xl shadow-xs active:scale-[0.98] transition-all",
            })}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Créer une réservation
          </Link>
        </div>
      </div>

      {/* Apple Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm hover:border-white/20 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/60">
                  {stat.label}
                </span>
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${stat.bgClass} group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-white/40 truncate mr-2">{stat.subtext}</span>
                  <span className="font-medium text-[#30d158] bg-[#30d158]/10 px-2 py-0.5 rounded-full border border-[#30d158]/20 shrink-0">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Activity Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-[#1c1c1e] border border-white/[0.08] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">Contrats récents</h3>
                <p className="text-xs text-white/40 mt-0.5">Mouvements et sorties en cours d'exploitation</p>
              </div>
              <Link
                href="/dashboard/bookings"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-[#0a84ff] hover:text-blue-300 hover:bg-blue-500/10 rounded-xl text-xs",
                })}
              >
                Voir tout
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-white/45 text-xs font-medium">Contrat</TableHead>
                    <TableHead className="text-white/45 text-xs font-medium">Client</TableHead>
                    <TableHead className="text-white/45 text-xs font-medium">Véhicule</TableHead>
                    <TableHead className="text-white/45 text-xs font-medium">Période</TableHead>
                    <TableHead className="text-white/45 text-xs font-medium">Montant</TableHead>
                    <TableHead className="text-white/45 text-xs font-medium text-right">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRentals.map((r, i) => (
                    <TableRow key={i} className="hover:bg-white/[0.03] border-white/[0.06] transition-colors">
                      <TableCell className="font-mono text-xs font-medium text-white/80 align-top">
                        {r.ref}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="font-medium text-sm text-white">{r.client}</div>
                        <div className="text-xs text-white/40 font-mono mt-0.5">
                          {r.phone}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="font-medium text-sm text-white">{r.car}</div>
                        <div className="text-xs text-white/40 mt-0.5">
                          {r.plate}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/60 text-xs align-top">
                        {r.period}
                      </TableCell>
                      <TableCell className="font-semibold text-sm text-white align-top">
                        {r.amount}
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${r.statusClass}`}>
                          {r.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              Actions rapides
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/bookings"
                className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex flex-col justify-between active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0a84ff]/15 flex items-center justify-center mb-3 text-[#0a84ff]">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white">Réservation</span>
                  <span className="block text-[10px] text-white/40 mt-0.5">Nouveau contrat</span>
                </div>
              </Link>

              <Link
                href="/dashboard/fleet"
                className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex flex-col justify-between active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#30d158]/15 flex items-center justify-center mb-3 text-[#30d158]">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white">Véhicule</span>
                  <span className="block text-[10px] text-white/40 mt-0.5">Ajout au parc</span>
                </div>
              </Link>

              <Link
                href="/dashboard/clients"
                className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex flex-col justify-between active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#5e5ce6]/15 flex items-center justify-center mb-3 text-[#5e5ce6]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white">Client</span>
                  <span className="block text-[10px] text-white/40 mt-0.5">Fiche & CIN</span>
                </div>
              </Link>

              <Link
                href="/dashboard/inspections"
                className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex flex-col justify-between active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#ffd60a]/15 flex items-center justify-center mb-3 text-[#ffd60a]">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white">État des lieux</span>
                  <span className="block text-[10px] text-white/40 mt-0.5">PWA Offline</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Maintenance & Due Alerts */}
          <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Alertes & Échéances
              </h3>
              <span className="text-[10px] font-semibold text-[#ffd60a] bg-[#ffd60a]/10 px-2 py-0.5 rounded-full border border-[#ffd60a]/20">
                2 à surveiller
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#ffd60a] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">
                  Visite technique dans 14 jours
                </p>
                <p className="text-[11px] text-white/40 mt-0.5">
                  Dacia Logan • Immat: 28419 | أ | 1
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#0a84ff] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">
                  Vidange moteur recommandée
                </p>
                <p className="text-[11px] text-white/40 mt-0.5">
                  Renault Clio 5 • À 45 000 km (dans 600 km)
                </p>
              </div>
            </div>
          </div>

          {/* Regulatory Compliance Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#30d158]/10 to-[#1c1c1e] border border-[#30d158]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#30d158] font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Conformité Réglementaire Marocaine</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Protection des données Loi 09-08 (CNDP), fiches de police DGSN et décharges radars NARSA intégrées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
