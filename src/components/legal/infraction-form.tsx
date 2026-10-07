"use client";

import { useState } from "react";
import { format } from "date-fns";
import { createAndMapInfraction } from "@/app/actions/infractions";
import { Scale, Loader2, Car, MapPin, Hash, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-[#131316] border border-white/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.02)] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/[0.08]">
          <DialogTitle className="text-lg font-bold text-[#fafafa] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Scale className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              Déclarer une Infraction
              <p className="text-[11px] font-normal text-[#a1a1aa] mt-0.5">Saisie des données NARSA et rattachement au contrat</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] font-medium flex items-center gap-2">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="vehicle_id" className="text-xs font-semibold text-[#a1a1aa]">Véhicule concerné *</Label>
                <div className="relative">
                  <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                  <select name="vehicle_id" id="vehicle_id" className="w-full bg-white/[0.03] border border-white/[0.08] text-[#fafafa] rounded-xl h-11 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none" required>
                    <option value="" className="bg-[#131316]">Sélectionner...</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id} className="bg-[#131316]">
                        {v.plate_number} ({v.brand} {v.model})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="infraction_type" className="text-xs font-semibold text-[#a1a1aa]">Type d'infraction *</Label>
                <select name="infraction_type" id="infraction_type" className="w-full bg-white/[0.03] border border-white/[0.08] text-[#fafafa] rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none" required>
                  <option value="" className="bg-[#131316]">Sélectionner...</option>
                  <option value="speeding" className="bg-[#131316]">Excès de Vitesse (Radar)</option>
                  <option value="red_light" className="bg-[#131316]">Franchissement Feu Rouge</option>
                  <option value="parking" className="bg-[#131316]">Stationnement Interdit</option>
                  <option value="accident" className="bg-[#131316]">Accident / Fuite</option>
                  <option value="other" className="bg-[#131316]">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="infraction_date" className="text-xs font-semibold text-[#a1a1aa]">Date et Heure exactes *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                  <Input 
                    type="datetime-local" 
                    id="infraction_date"
                    name="infraction_date"
                    required
                    max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                    className="pl-10 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount_mad" className="text-xs font-semibold text-[#a1a1aa]">Montant (MAD) *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                  <Input 
                    type="number" 
                    id="amount_mad"
                    name="amount_mad"
                    required
                    min="0"
                    step="50"
                    placeholder="Ex: 300"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs font-semibold text-[#a1a1aa]">Lieu de l'infraction *</Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                <Input 
                  type="text" 
                  id="location"
                  name="location"
                  required
                  placeholder="Ex: Autoroute A3, PK 15 vers Casablanca"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 pb-2">
              <Label htmlFor="radar_reference" className="text-xs font-semibold text-[#a1a1aa]">N° Appareil Radar (Optionnel)</Label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                <Input 
                  type="text" 
                  id="radar_reference"
                  name="radar_reference"
                  placeholder="Ex: FIXE-A3-15"
                  className="pl-10"
                />
              </div>
              <p className="text-[10px] text-[#71717a] ml-1 mt-1">Permet un suivi précis des radars NARSA.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 pb-2 border-t border-white/[0.08] sticky bottom-0 bg-[#131316]">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                disabled={loading}
                className="h-11 rounded-xl text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.04]"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold h-11 px-6 rounded-xl shadow-xs"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {loading ? 'Recherche Contrat...' : 'Enregistrer & Relier'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
