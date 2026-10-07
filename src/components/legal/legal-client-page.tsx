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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function LegalClientPage({ initialInfractions = [], vehicles = [] }: { initialInfractions: any[], vehicles: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infractions, setInfractions] = useState(initialInfractions);

  const handleSuccess = () => {
    setIsModalOpen(false);
    window.location.reload(); // Quick refresh to get new infractions and matched client
  };

  const getInfractionColor = (type: string) => {
    switch(type) {
      case 'speeding': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'red_light': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'parking': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'accident': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getInfractionLabel = (type: string) => {
    switch(type) {
      case 'speeding': return 'Excès de Vitesse';
      case 'red_light': return 'Feu Rouge';
      case 'parking': return 'Stationnement';
      case 'accident': return 'Accident';
      default: return 'Autre';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Suite Légale & Infractions</h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Gestion des amendes NARSA et transfert de responsabilité DGSN
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Enregistrer une Infraction
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-950 border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-24 w-24 text-slate-100" />
          </div>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-400">Infractions Non Résolues</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">
              {infractions.filter(i => i.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-950 border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-24 w-24 text-slate-100" />
          </div>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-400">Responsabilités Transférées</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">
              {infractions.filter(i => i.status === 'dgsn_transferred').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-950 border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Scale className="h-24 w-24 text-slate-100" />
          </div>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-400">Montant Total à Récupérer</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">
              {infractions.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount_mad || 0), 0)} DH
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="bg-slate-950 border-slate-800">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-900/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Détails de l'Infraction</TableHead>
                <TableHead className="text-slate-400 font-medium">Véhicule</TableHead>
                <TableHead className="text-slate-400 font-medium">Client Responsable</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Amende (MAD)</TableHead>
                <TableHead className="text-slate-400 font-medium text-center">Statut</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {infractions.length === 0 ? (
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableCell colSpan={6} className="py-12 text-center text-slate-500">
                    <Scale className="h-12 w-12 mx-auto text-slate-700 mb-3" />
                    <p className="font-medium text-slate-300">Aucune infraction enregistrée.</p>
                    <p className="text-sm mt-1">Les amendes NARSA apparaîtront ici.</p>
                  </TableCell>
                </TableRow>
              ) : infractions.map((infraction) => (
                <TableRow key={infraction.id} className="border-slate-800 hover:bg-slate-900/50 transition-colors">
                  <TableCell className="py-4 align-top">
                    <div className="flex flex-col">
                      <Badge variant="outline" className={`w-fit mb-2 border-0 ${getInfractionColor(infraction.infraction_type)}`}>
                        {getInfractionLabel(infraction.infraction_type)}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium text-sm">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        {format(new Date(infraction.infraction_date), "dd MMM yyyy, HH:mm", { locale: fr })}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {infraction.location}
                      </div>
                      {infraction.radar_reference && (
                         <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                          <Hash className="h-3.5 w-3.5" />
                          Radar: {infraction.radar_reference}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-top">
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                        <Car className="h-4 w-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{infraction.vehicle?.plate_number}</p>
                        <p className="text-xs text-slate-500">{infraction.vehicle?.brand} {infraction.vehicle?.model}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-top">
                    {infraction.client ? (
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg">
                          <User className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{infraction.client.full_name}</p>
                          <p className="text-xs text-slate-500">Permis: {infraction.client.driving_license_number}</p>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 gap-1.5 border-0">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Aucun contrat actif trouvé
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-right font-medium text-slate-200 align-top">
                    {infraction.amount_mad ? `${infraction.amount_mad} DH` : '-'}
                  </TableCell>
                  <TableCell className="py-4 text-center align-top">
                    <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 font-medium">
                      {infraction.status === 'pending' ? 'En attente' : infraction.status}
                    </Badge>
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
                          className: "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-slate-100 inline-flex items-center",
                        })}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Générer PDF DGSN
                      </a>
                    ) : (
                      <Button 
                        disabled
                        variant="outline"
                        size="sm"
                        className="bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Générer PDF DGSN
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

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
