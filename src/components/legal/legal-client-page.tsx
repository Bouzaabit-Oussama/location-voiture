"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Scale, AlertTriangle, ShieldCheck, FileText, Plus, 
  MapPin, Clock, Hash, Car, User
} from "lucide-react";
import { InfractionForm } from "./infraction-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function LegalClientPage({ initialInfractions = [], vehicles = [] }: { initialInfractions: any[], vehicles: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infractions, setInfractions] = useState(initialInfractions);

  const handleSuccess = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const getInfractionColor = (type: string) => {
    switch (type) {
      case 'speeding': return "bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/25";
      case 'red_light': return "bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/25";
      case 'parking': return "bg-[#ffd60a]/15 text-[#ffd60a] border-[#ffd60a]/25";
      default: return "bg-[#0a84ff]/15 text-[#0a84ff] border-[#0a84ff]/25";
    }
  };

  const getInfractionLabel = (type: string) => {
    switch (type) {
      case 'speeding': return "Excès de vitesse";
      case 'red_light': return "Feu rouge";
      case 'parking': return "Stationnement";
      default: return type;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Contentieux & Infractions Radar (NARSA)
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 flex items-center gap-2">
            <Scale className="h-3.5 w-3.5 text-[#0a84ff]" />
            Gestion des amendes radar et décharge de responsabilité légale
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl shadow-xs active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Enregistrer une Infraction
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <p className="text-xs font-medium text-white/50">Infractions Non Résolues</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
            {infractions.filter(i => i.status === 'pending').length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <p className="text-xs font-medium text-white/50">Responsabilités Transférées</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#30d158] mt-2">
            {infractions.filter(i => i.status === 'dgsn_transferred').length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <p className="text-xs font-medium text-white/50">Montant Total à Récupérer</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#ffd60a] mt-2">
            {infractions.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount_mad || 0), 0).toLocaleString("fr-MA")} DH
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl bg-[#1c1c1e] border border-white/[0.08] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-white/45 text-xs font-medium">Détails de l'Infraction</TableHead>
                <TableHead className="text-white/45 text-xs font-medium">Véhicule</TableHead>
                <TableHead className="text-white/45 text-xs font-medium">Client Responsable</TableHead>
                <TableHead className="text-white/45 text-xs font-medium text-right">Amende (MAD)</TableHead>
                <TableHead className="text-white/45 text-xs font-medium text-center">Statut</TableHead>
                <TableHead className="text-white/45 text-xs font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {infractions.length === 0 ? (
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableCell colSpan={6} className="py-12 text-center text-white/40">
                    <Scale className="h-10 w-10 mx-auto text-white/20 mb-3" />
                    <p className="font-semibold text-white">Aucune infraction enregistrée</p>
                    <p className="text-xs mt-1">Les avis radar NARSA apparaîtront ici.</p>
                  </TableCell>
                </TableRow>
              ) : infractions.map((infraction) => (
                <TableRow key={infraction.id} className="border-white/[0.06] hover:bg-white/[0.03] transition-colors">
                  <TableCell className="py-4 align-top">
                    <div className="flex flex-col">
                      <span className={`w-fit mb-2 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getInfractionColor(infraction.infraction_type)}`}>
                        {getInfractionLabel(infraction.infraction_type)}
                      </span>
                      <div className="flex items-center gap-1.5 text-white font-medium text-xs">
                        <Clock className="h-3.5 w-3.5 text-white/40" />
                        {format(new Date(infraction.infraction_date), "dd MMM yyyy, HH:mm", { locale: fr })}
                      </div>
                      <div className="flex items-center gap-1.5 text-white/40 text-[11px] mt-1">
                        <MapPin className="h-3 w-3" />
                        {infraction.location}
                      </div>
                      {infraction.radar_reference && (
                         <div className="flex items-center gap-1.5 text-white/40 text-[11px] mt-1">
                          <Hash className="h-3 w-3" />
                          Radar: {infraction.radar_reference}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-top">
                    <div className="flex items-start gap-3">
                      <div className="bg-white/[0.04] border border-white/10 p-2 rounded-xl">
                        <Car className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{infraction.vehicle?.plate_number}</p>
                        <p className="text-xs text-white/40">{infraction.vehicle?.brand} {infraction.vehicle?.model}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-top">
                    {infraction.client ? (
                      <div className="flex items-start gap-3">
                        <div className="bg-[#0a84ff]/10 border border-[#0a84ff]/20 p-2 rounded-xl">
                          <User className="h-4 w-4 text-[#0a84ff]" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{infraction.client.full_name}</p>
                          <p className="text-xs text-white/40">Permis: {infraction.client.driving_license_number}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/25">
                        <AlertTriangle className="h-3 w-3" />
                        Aucun contrat actif trouvé
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-right font-semibold text-white text-sm align-top">
                    {infraction.amount_mad ? `${infraction.amount_mad.toLocaleString("fr-MA")} DH` : '-'}
                  </TableCell>
                  <TableCell className="py-4 text-center align-top">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] text-white/70 border border-white/10">
                      {infraction.status === 'pending' ? 'En attente' : infraction.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right align-top">
                    {infraction.client ? (
                      <a 
                        href={`/print/infraction/${infraction.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08] rounded-xl text-xs inline-flex items-center active:scale-95 transition-all",
                        })}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Lettre NARSA
                      </a>
                    ) : (
                      <Button 
                        disabled
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-white/[0.06] text-white/30 cursor-not-allowed rounded-xl text-xs"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Lettre NARSA
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {isModalOpen && (
        <InfractionForm 
          vehicles={vehicles}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
