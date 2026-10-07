"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Scale, AlertTriangle, FileText, Plus, 
  MapPin, Clock, Hash, Car, User, ShieldCheck
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
      case 'speeding': return "#ef4444";
      case 'red_light': return "#ef4444";
      case 'parking': return "#f59e0b";
      default: return "#3b82f6";
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
    <div className="space-y-6 sm:space-y-8 lx-animate-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#fafafa]">
            Contentieux & Infractions Radar
          </h1>
          <p className="text-sm text-[#71717a] mt-1 flex items-center gap-2">
            <Scale className="h-3.5 w-3.5 text-[#3b82f6]" strokeWidth={2} />
            Gestion des amendes NARSA et décharge de responsabilité légale
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all h-10 px-5"
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Enregistrer une Infraction
        </Button>
      </div>

      {/* ─── Analytics Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div 
          className="p-5 rounded-2xl bg-[#131316] border border-white/[0.08] flex flex-col justify-between"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)" }}
        >
          <p className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Infractions Non Résolues</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#fafafa] mt-2">
            {infractions.filter(i => i.status === 'pending').length}
          </p>
        </div>
        <div 
          className="p-5 rounded-2xl bg-[#131316] border border-white/[0.08] flex flex-col justify-between"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)" }}
        >
          <p className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Responsabilités Transférées</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#22c55e] mt-2">
            {infractions.filter(i => i.status === 'dgsn_transferred').length}
          </p>
        </div>
        <div 
          className="p-5 rounded-2xl bg-[#131316] border border-white/[0.08] flex flex-col justify-between"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)" }}
        >
          <p className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Montant Total à Récupérer</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#f59e0b] mt-2">
            {infractions.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount_mad || 0), 0).toLocaleString("fr-MA")} DH
          </p>
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <div 
        className="rounded-2xl bg-[#131316] border border-white/[0.08] overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)" }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/40">
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11">Détails de l'Infraction</TableHead>
                <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11 hidden md:table-cell">Véhicule</TableHead>
                <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11">Client Responsable</TableHead>
                <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11 text-right">Amende (MAD)</TableHead>
                <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11 text-center">Statut</TableHead>
                <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {infractions.length === 0 ? (
                <TableRow className="border-white/[0.04] hover:bg-transparent">
                  <TableCell colSpan={6} className="py-16 text-center">
                    <Scale className="h-10 w-10 mx-auto text-[#71717a] mb-4" strokeWidth={1} />
                    <p className="font-semibold text-[#fafafa] mb-1">Aucune infraction enregistrée</p>
                    <p className="text-sm text-[#a1a1aa]">Les avis radar NARSA apparaîtront ici.</p>
                  </TableCell>
                </TableRow>
              ) : infractions.map((infraction) => {
                const color = getInfractionColor(infraction.infraction_type);

                return (
                <TableRow key={infraction.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors group/row">
                  <TableCell className="align-middle py-4">
                    <div className="flex flex-col">
                      <span 
                        className="w-fit mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          background: `${color}12`,
                          color: color,
                          border: `1px solid ${color}25`,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                        {getInfractionLabel(infraction.infraction_type)}
                      </span>
                      <div className="flex items-center gap-2 text-[#fafafa] font-medium text-sm">
                        <Clock className="h-3.5 w-3.5 text-[#71717a]" strokeWidth={1.75} />
                        {format(new Date(infraction.infraction_date), "dd MMM yyyy, HH:mm", { locale: fr })}
                      </div>
                      <div className="flex items-center gap-2 text-[#a1a1aa] text-[11px] mt-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#71717a]" strokeWidth={1.75} />
                        {infraction.location}
                      </div>
                      {infraction.radar_reference && (
                         <div className="flex items-center gap-2 text-[#a1a1aa] text-[11px] mt-1">
                          <Hash className="h-3.5 w-3.5 text-[#71717a]" strokeWidth={1.75} />
                          Radar: {infraction.radar_reference}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-middle py-4 hidden md:table-cell">
                    <div className="flex items-start gap-3">
                      <div className="bg-white/[0.03] border border-white/[0.08] p-2.5 rounded-xl">
                        <Car className="h-4 w-4 text-[#a1a1aa]" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="font-medium text-[#fafafa] text-sm group-hover/row:text-[#3b82f6] transition-colors">{infraction.vehicle?.plate_number}</p>
                        <p className="text-[11px] font-mono text-[#71717a] mt-0.5">{infraction.vehicle?.brand} {infraction.vehicle?.model}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="align-middle py-4">
                    {infraction.client ? (
                      <div className="flex items-start gap-3">
                        <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 p-2.5 rounded-xl">
                          <User className="h-4 w-4 text-[#3b82f6]" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="font-medium text-[#fafafa] text-sm">{infraction.client.full_name}</p>
                          <p className="text-[11px] font-mono text-[#71717a] mt-0.5">Permis: {infraction.client.driving_license_number}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20">
                        <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} />
                        Aucun contrat actif
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="align-middle py-4 text-right font-semibold text-[#fafafa] text-sm">
                    {infraction.amount_mad ? `${infraction.amount_mad.toLocaleString("fr-MA")} DH` : '-'}
                  </TableCell>
                  <TableCell className="align-middle py-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.04] text-[#a1a1aa] border border-white/[0.08]">
                      {infraction.status === 'pending' ? 'En attente' : infraction.status}
                    </span>
                  </TableCell>
                  <TableCell className="align-middle py-4 text-right">
                    {infraction.client ? (
                      <a 
                        href={`/print/infraction/${infraction.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "bg-white/[0.03] border-white/[0.08] text-[#fafafa] hover:bg-white/[0.06] rounded-xl text-[11px] inline-flex items-center active:scale-[0.98] transition-all h-9 px-3",
                        })}
                      >
                        <FileText className="h-3.5 w-3.5 mr-2 text-[#a1a1aa]" strokeWidth={1.75} />
                        Lettre NARSA
                      </a>
                    ) : (
                      <Button 
                        disabled
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-white/[0.04] text-white/20 cursor-not-allowed rounded-xl text-[11px] h-9 px-3"
                      >
                        <FileText className="h-3.5 w-3.5 mr-2" strokeWidth={1.75} />
                        Lettre NARSA
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )})}
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
