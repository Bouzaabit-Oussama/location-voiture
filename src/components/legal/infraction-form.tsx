"use client";

import { useState } from "react";
import { format } from "date-fns";
import { createAndMapInfraction } from "@/app/actions/infractions";
import { Scale, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg bg-slate-950 border-slate-800 shadow-xl animate-in zoom-in-95 duration-200">
        <CardHeader className="border-b border-slate-800 flex flex-row items-center gap-4 py-4">
          <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            <Scale className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <CardTitle className="text-slate-100 text-lg">Déclarer une Infraction</CardTitle>
            <CardDescription className="text-slate-400">Saisie des données NARSA</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle_id" className="text-slate-300">Véhicule concerné *</Label>
                <Select name="vehicle_id" required>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id} className="text-slate-100 focus:bg-slate-800 focus:text-slate-50">
                        {v.plate_number} ({v.brand} {v.model})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="infraction_type" className="text-slate-300">Type d'infraction *</Label>
                <Select name="infraction_type" required>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    <SelectItem value="speeding" className="text-slate-100 focus:bg-slate-800">Excès de Vitesse (Radar)</SelectItem>
                    <SelectItem value="red_light" className="text-slate-100 focus:bg-slate-800">Franchissement Feu Rouge</SelectItem>
                    <SelectItem value="parking" className="text-slate-100 focus:bg-slate-800">Stationnement Interdit</SelectItem>
                    <SelectItem value="accident" className="text-slate-100 focus:bg-slate-800">Accident / Fuite</SelectItem>
                    <SelectItem value="other" className="text-slate-100 focus:bg-slate-800">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="infraction_date" className="text-slate-300">Date et Heure exactes *</Label>
                <Input 
                  type="datetime-local" 
                  id="infraction_date"
                  name="infraction_date"
                  required
                  max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                  className="bg-slate-900 border-slate-800 text-slate-100 [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount_mad" className="text-slate-300">Montant (MAD) *</Label>
                <Input 
                  type="number" 
                  id="amount_mad"
                  name="amount_mad"
                  required
                  min="0"
                  step="50"
                  placeholder="Ex: 300"
                  className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-300">Lieu de l'infraction *</Label>
              <Input 
                type="text" 
                id="location"
                name="location"
                required
                placeholder="Ex: Autoroute A3, PK 15 vers Casablanca"
                className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="radar_reference" className="text-slate-300">N° Appareil Radar (Optionnel)</Label>
              <Input 
                type="text" 
                id="radar_reference"
                name="radar_reference"
                placeholder="Ex: FIXE-A3-15"
                className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500">Permet un suivi précis des radars NARSA.</p>
            </div>
          </CardContent>

          <CardFooter className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? 'Recherche Contrat...' : 'Enregistrer & Relier'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
