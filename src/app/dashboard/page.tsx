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
      subtext: "11 disponibles • 3 en location",
      change: "+2 ce mois",
      icon: Car,
      iconColor: "text-blue-500",
      bgClass: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Contrats actifs",
      value: "8",
      subtext: "2 retours prévus aujourd'hui",
      change: "+15%",
      icon: CalendarCheck2,
      iconColor: "text-emerald-500",
      bgClass: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Chiffre d'affaires (Mois)",
      value: "42 800 MAD",
      subtext: "Encaissé: 38 400 MAD",
      change: "+12.4%",
      icon: Banknote,
      iconColor: "text-amber-500",
      bgClass: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Taux de rotation",
      value: "78%",
      subtext: "Période active",
      change: "Optimal",
      icon: TrendingUp,
      iconColor: "text-purple-500",
      bgClass: "bg-purple-500/10 border-purple-500/20",
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
      statusColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
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
      statusColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
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
      statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
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
      statusColor: "bg-slate-800 text-slate-300 border-slate-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Tableau de bord
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Supervision de la flotte, réservations et gestion des contrats
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/bookings">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Créer une réservation
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-slate-950 border-slate-800 overflow-hidden hover:bg-slate-900 transition-colors group">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-xl border ${stat.bgClass} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-100">{stat.value}</div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-slate-500">{stat.subtext}</span>
                  <span className="font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content: Left (2 Cols) + Right (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Activity Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800">
              <div className="space-y-1">
                <CardTitle className="text-lg text-slate-100">Contrats récents</CardTitle>
                <CardDescription className="text-slate-400">
                  Mouvements et sorties en cours d'exploitation
                </CardDescription>
              </div>
              <Link
                href="/dashboard/bookings"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10",
                })}
              >
                Voir tout
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-900/50">
                    <TableRow className="hover:bg-transparent border-slate-800">
                      <TableHead className="text-slate-400 font-medium">Contrat</TableHead>
                      <TableHead className="text-slate-400 font-medium">Client</TableHead>
                      <TableHead className="text-slate-400 font-medium">Véhicule</TableHead>
                      <TableHead className="text-slate-400 font-medium">Période</TableHead>
                      <TableHead className="text-slate-400 font-medium">Montant</TableHead>
                      <TableHead className="text-slate-400 font-medium text-right">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRentals.map((r, i) => (
                      <TableRow key={i} className="hover:bg-slate-900/50 border-slate-800 transition-colors">
                        <TableCell className="font-mono font-medium text-slate-300 align-top">
                          {r.ref}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="font-medium text-slate-200">{r.client}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            {r.phone}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="font-medium text-slate-200">{r.car}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {r.plate}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm align-top">
                          {r.period}
                        </TableCell>
                        <TableCell className="font-medium text-slate-200 align-top">
                          {r.amount}
                        </TableCell>
                        <TableCell className="text-right align-top">
                          <Badge variant="outline" className={`border-0 ${r.statusColor}`}>
                            {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Quick actions & Compliance */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/dashboard/bookings"
                  className="group p-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
                >
                  <div className="bg-blue-500/10 p-2 rounded-lg w-fit mb-3 border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <CalendarCheck2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-200">
                      Réservation
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Nouveau contrat</span>
                  </div>
                </Link>

                <Link
                  href="/dashboard/fleet"
                  className="group p-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
                >
                  <div className="bg-emerald-500/10 p-2 rounded-lg w-fit mb-3 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Car className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-200">
                      Véhicule
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Ajout au parc</span>
                  </div>
                </Link>

                <Link
                  href="/dashboard/clients"
                  className="group p-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
                >
                  <div className="bg-purple-500/10 p-2 rounded-lg w-fit mb-3 border border-purple-500/20 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-200">
                      Client
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">CIN & Permis</span>
                  </div>
                </Link>

                <Link
                  href="/dashboard/inspections"
                  className="group p-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
                >
                  <div className="bg-amber-500/10 p-2 rounded-lg w-fit mb-3 border border-amber-500/20 group-hover:scale-110 transition-transform">
                    <ClipboardCheck className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-200">
                      État des lieux
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">PWA Offline</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance & Due Alerts */}
          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-800">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Alertes & Échéances
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 border-amber-500/20 border-0">
                2 à surveiller
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3 transition-colors hover:bg-amber-500/10">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Visite technique dans 14 jours
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Dacia Logan • Immat: 28419 | أ | 1
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-3 transition-colors hover:bg-blue-500/10">
                <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Vidange moteur recommandée
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Renault Clio 5 • À 45 000 km (dans 600 km)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moroccan Regulatory Compliance */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/20 space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-32 h-32 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-bold relative z-10">
              <ShieldCheck className="w-5 h-5" />
              <span>Conformité Légale Marocaine</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">
              Vos contrats respectent les normes CNDP (Loi 09-08) et génèrent automatiquement la fiche de renseignement police (DGSN) ainsi que les avis d'infraction NARSA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
