"use client";

import { useState } from "react";
import { format } from "date-fns";
import { createAndMapInfraction } from "@/app/actions/infractions";
import { Scale, Loader2 } from "lucide-react";

export function InfractionForm({ 
  vehicles, 
  onClose,
  onSuccess 
}: { 
  vehicles: any[], 
  onClose: () => void,
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // We need an exact Date object for the server action
    // HTML datetime-local inputs return "YYYY-MM-DDTHH:mm"
    const dateStr = formData.get("infraction_date") as string;
    
    const infraction_type = formData.get("infraction_type") as "speeding" | "parking" | "red_light" | "accident" | "other" | undefined;
    const result = await createAndMapInfraction({
      vehicle_id: formData.get("vehicle_id") as string,
      infraction_date: new Date(dateStr).toISOString(),
      infraction_type: infraction_type,
      amount_mad: Number(formData.get("amount_mad")),
      location: formData.get("location") as string,
      radar_reference: formData.get("radar_reference") as string || undefined,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Scale className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Déclarer une Infraction</h2>
            <p className="text-sm text-gray-500">Saisie des données NARSA</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Véhicule concerné *</label>
              <select 
                name="vehicle_id" 
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              >
                <option value="">Sélectionner...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.plate_number} ({v.brand} {v.model})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Type d'infraction *</label>
              <select 
                name="infraction_type" 
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              >
                <option value="speeding">Excès de Vitesse (Radar)</option>
                <option value="red_light">Franchissement Feu Rouge</option>
                <option value="parking">Stationnement Interdit</option>
                <option value="accident">Accident / Fuite</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Date et Heure exactes *</label>
              <input 
                type="datetime-local" 
                name="infraction_date"
                required
                max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Montant (MAD) *</label>
              <input 
                type="number" 
                name="amount_mad"
                required
                min="0"
                step="50"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                placeholder="Ex: 300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Lieu de l'infraction *</label>
            <input 
              type="text" 
              name="location"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              placeholder="Ex: Autoroute A3, PK 15 vers Casablanca"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">N° Appareil Radar (Optionnel)</label>
            <input 
              type="text" 
              name="radar_reference"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              placeholder="Ex: FIXE-A3-15"
            />
            <p className="text-xs text-gray-500">Permet un suivi précis des radars NARSA.</p>
          </div>

          <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Recherche Contrat...' : 'Enregistrer & Relier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
