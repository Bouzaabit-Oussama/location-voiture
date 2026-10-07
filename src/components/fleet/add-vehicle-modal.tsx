"use client";

import { useActionState } from "react";
import { addVehicle, type FleetActionState } from "@/app/actions/fleet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Car, Calendar, CreditCard, Hash } from "lucide-react";

const initialState: FleetActionState = {};

const BRANDS = [
  "Dacia", "Renault", "Peugeot", "Citroën", "Hyundai", "Kia",
  "Toyota", "Volkswagen", "Fiat", "Ford", "BMW", "Mercedes-Benz",
  "Audi", "Seat", "Skoda", "Nissan", "Opel", "Suzuki",
];

const CATEGORIES = [
  { value: "economy", label: "Économique" },
  { value: "compact", label: "Compacte" },
  { value: "sedan", label: "Berline" },
  { value: "suv", label: "SUV" },
  { value: "minivan", label: "Monospace" },
  { value: "luxury", label: "Luxe" },
  { value: "utility", label: "Utilitaire" },
];

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVehicleModal({ isOpen, onClose }: AddVehicleModalProps) {
  const [state, formAction, isPending] = useActionState(addVehicle, initialState);

  if (state.success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#131316] border border-white/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.02)] p-8 max-w-sm text-center">
          <div className="w-16 h-16 bg-[#22c55e]/10 text-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
          </div>
          <DialogTitle className="text-xl font-bold text-[#fafafa] mb-2">
            Véhicule ajouté !
          </DialogTitle>
          <p className="text-sm text-[#a1a1aa] mb-6">
            Le véhicule a été ajouté à votre flotte et est prêt à être loué.
          </p>
          <Button 
            onClick={onClose} 
            className="w-full bg-[#fafafa] hover:bg-white text-black font-semibold rounded-xl h-11"
          >
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#131316] border border-white/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.02)] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/[0.08]">
          <DialogTitle className="text-lg font-bold text-[#fafafa] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <Car className="w-4 h-4 text-[#fafafa]" />
            </div>
            Ajouter un véhicule
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          {state.error && (
            <div className="mb-6 p-4 rounded-xl text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] font-medium flex items-center gap-2">
              <span className="shrink-0">⚠️</span> {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            {/* Row 1: Plate + Brand + Model */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="plate_number" className="text-xs font-semibold text-[#a1a1aa]">Immatriculation *</Label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                  <Input id="plate_number" name="plate_number" type="text" placeholder="12345-A-67" className="pl-10 bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-xs font-semibold text-[#a1a1aa]">Marque *</Label>
                <select id="brand" name="brand" className="w-full bg-white/[0.03] border border-white/[0.08] text-[#fafafa] rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none" required>
                  <option value="" className="bg-[#131316]">Choisir...</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b} className="bg-[#131316]">{b}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-xs font-semibold text-[#a1a1aa]">Modèle *</Label>
                <Input id="model" name="model" type="text" placeholder="Ex: Logan" className="bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" required />
              </div>
            </div>

            {/* Row 2: Year + Category + Color */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="year" className="text-xs font-semibold text-[#a1a1aa]">Année *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                  <Input id="year" name="year" type="number" min={new Date().getFullYear() - 5} max={new Date().getFullYear() + 1} placeholder={String(new Date().getFullYear())} className="pl-10 bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" required />
                </div>
                <p className="text-[10px] text-[#71717a]">Max 5 ans (Ministère du Transport)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-semibold text-[#a1a1aa]">Catégorie</Label>
                <select id="category" name="category" className="w-full bg-white/[0.03] border border-white/[0.08] text-[#fafafa] rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none">
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#131316]">{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color" className="text-xs font-semibold text-[#a1a1aa]">Couleur</Label>
                <Input id="color" name="color" type="text" placeholder="Blanc" className="bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" />
              </div>
            </div>

            {/* Row 3: Fuel + Transmission + Seats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fuel_type" className="text-xs font-semibold text-[#a1a1aa]">Carburant</Label>
                <select id="fuel_type" name="fuel_type" className="w-full bg-white/[0.03] border border-white/[0.08] text-[#fafafa] rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none">
                  <option value="diesel" className="bg-[#131316]">Diesel</option>
                  <option value="gasoline" className="bg-[#131316]">Essence</option>
                  <option value="hybrid" className="bg-[#131316]">Hybride</option>
                  <option value="electric" className="bg-[#131316]">Électrique</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission" className="text-xs font-semibold text-[#a1a1aa]">Transmission</Label>
                <select id="transmission" name="transmission" className="w-full bg-white/[0.03] border border-white/[0.08] text-[#fafafa] rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none">
                  <option value="manual" className="bg-[#131316]">Manuelle</option>
                  <option value="automatic" className="bg-[#131316]">Automatique</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seats" className="text-xs font-semibold text-[#a1a1aa]">Places</Label>
                <Input id="seats" name="seats" type="number" min={2} max={9} defaultValue={5} className="bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" />
              </div>
            </div>

            {/* Row 4: Daily Rate + Mileage + VIN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="daily_rate_mad" className="text-xs font-semibold text-[#a1a1aa]">Tarif journalier (MAD) *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                  <Input id="daily_rate_mad" name="daily_rate_mad" type="number" min={0} step={10} placeholder="250" className="pl-10 bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage_km" className="text-xs font-semibold text-[#a1a1aa]">Kilométrage</Label>
                <Input id="mileage_km" name="mileage_km" type="number" min={0} placeholder="0" className="bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vin" className="text-xs font-semibold text-[#a1a1aa]">VIN / Châssis</Label>
                <Input id="vin" name="vin" type="text" placeholder="Optionnel" className="bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" />
              </div>
            </div>

            {/* Row 5: Document Expiries */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-white/[0.04]">
              <div className="space-y-2 mt-2">
                <Label htmlFor="insurance_expiry" className="text-xs font-semibold text-[#a1a1aa]">Expiration Assurance</Label>
                <Input id="insurance_expiry" name="insurance_expiry" type="date" className="bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" />
              </div>
              <div className="space-y-2 mt-2">
                <Label htmlFor="technical_visit_expiry" className="text-xs font-semibold text-[#a1a1aa]">Expiration Visite Tech.</Label>
                <Input id="technical_visit_expiry" name="technical_visit_expiry" type="date" className="bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" />
              </div>
              <div className="space-y-2 mt-2">
                <Label htmlFor="vignette_expiry" className="text-xs font-semibold text-[#a1a1aa]">Expiration Vignette</Label>
                <Input id="vignette_expiry" name="vignette_expiry" type="date" className="bg-white/[0.03] border-white/[0.08] text-[#fafafa] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-white/20" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 pb-2 border-t border-white/[0.08] sticky bottom-0 bg-[#131316]">
              <Button type="button" variant="ghost" onClick={onClose} className="h-11 rounded-xl text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.04]">
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#fafafa] hover:bg-white text-black font-semibold h-11 px-6 rounded-xl shadow-xs"
              >
                {isPending ? "Ajout..." : "Ajouter le véhicule"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
