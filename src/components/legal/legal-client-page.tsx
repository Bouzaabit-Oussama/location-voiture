"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Scale, AlertTriangle, ShieldCheck, FileText, Plus, 
  MapPin, Clock, Hash, Car, User
} from "lucide-react";
import { InfractionForm } from "./infraction-form";

export function LegalClientPage({ initialInfractions = [], vehicles = [] }: { initialInfractions: any[], vehicles: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infractions, setInfractions] = useState(initialInfractions);

  const handleSuccess = () => {
    setIsModalOpen(false);
    window.location.reload(); // Quick refresh to get new infractions and matched client
  };

  const getInfractionColor = (type: string) => {
    switch(type) {
      case 'speeding': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'red_light': return 'bg-red-100 text-red-800 border-red-200';
      case 'parking': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accident': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Suite Légale & Infractions</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Gestion des amendes NARSA et transfert de responsabilité DGSN
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Enregistrer une Infraction
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-24 w-24" />
          </div>
          <p className="text-sm font-medium text-gray-500">Infractions Non Résolues</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {infractions.filter(i => i.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-24 w-24" />
          </div>
          <p className="text-sm font-medium text-gray-500">Responsabilités Transférées</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {infractions.filter(i => i.status === 'dgsn_transferred').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Scale className="h-24 w-24" />
          </div>
          <p className="text-sm font-medium text-gray-500">Montant Total à Récupérer</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {infractions.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount_mad || 0), 0)} DH
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <tr>
                <th className="py-4 px-6">Détails de l'Infraction</th>
                <th className="py-4 px-6">Véhicule</th>
                <th className="py-4 px-6">Client Responsable</th>
                <th className="py-4 px-6 text-right">Amende (MAD)</th>
                <th className="py-4 px-6 text-center">Statut</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {infractions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <Scale className="h-12 w-12 mx-auto text-gray-200 mb-3" />
                    <p className="font-medium">Aucune infraction enregistrée.</p>
                    <p className="text-sm mt-1">Les amendes NARSA apparaîtront ici.</p>
                  </td>
                </tr>
              ) : infractions.map((infraction) => (
                <tr key={infraction.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border w-fit mb-2 ${getInfractionColor(infraction.infraction_type)}`}>
                        {getInfractionLabel(infraction.infraction_type)}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {format(new Date(infraction.infraction_date), "dd MMM yyyy, HH:mm", { locale: fr })}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {infraction.location}
                      </div>
                      {infraction.radar_reference && (
                         <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                          <Hash className="h-3.5 w-3.5" />
                          Radar: {infraction.radar_reference}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Car className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{infraction.vehicle?.plate_number}</p>
                        <p className="text-xs text-gray-500">{infraction.vehicle?.brand} {infraction.vehicle?.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {infraction.client ? (
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{infraction.client.full_name}</p>
                          <p className="text-xs text-gray-500">Permis: {infraction.client.driving_license_number}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Aucun contrat actif trouvé
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-gray-900">
                    {infraction.amount_mad ? `${infraction.amount_mad} DH` : '-'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {infraction.status === 'pending' ? 'En attente' : infraction.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {infraction.client ? (
                      <a 
                        href={`/print/infraction/${infraction.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                      >
                        <FileText className="h-4 w-4" />
                        Générer PDF DGSN
                      </a>
                    ) : (
                      <button 
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        <FileText className="h-4 w-4" />
                        Générer PDF DGSN
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
