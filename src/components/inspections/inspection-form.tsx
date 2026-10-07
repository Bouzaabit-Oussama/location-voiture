"use client";

import { useState, useRef, useEffect } from "react";
import { queueForSync } from "@/lib/offline-store";
import { createInspection } from "@/app/actions/inspections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InspectionFormProps {
  vehicles: any[];
  bookings: any[];
  onComplete: () => void;
  onCancel: () => void;
}

export function InspectionForm({ vehicles, bookings, onComplete, onCancel }: InspectionFormProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [bookingId, setBookingId] = useState("");
  const [type, setType] = useState<"check_in" | "check_out">("check_in");
  const [fuelLevel, setFuelLevel] = useState<number>(8);
  const [mileage, setMileage] = useState<string>("");
  const [cleanliness, setCleanliness] = useState<"clean" | "average" | "dirty">("clean");
  const [notes, setNotes] = useState("");

  const selectedBooking = bookings.find((b) => b.id === bookingId);
  const selectedVehicle = vehicles.find((v) => v.id === selectedBooking?.vehicle_id);

  // Signature Pads
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const agentCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingClient, setIsDrawingClient] = useState(false);
  const [isDrawingAgent, setIsDrawingAgent] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Signature Pad Logic
  const startDrawing = (
    e: React.MouseEvent | React.TouchEvent,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    setDrawing: (val: boolean) => void
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (
    e: React.MouseEvent | React.TouchEvent,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    isDrawing: boolean
  ) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (setDrawing: (val: boolean) => void) => {
    setDrawing(false);
  };

  const clearCanvas = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId || !selectedVehicle || !mileage) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const clientSignature = clientCanvasRef.current?.toDataURL() || null;
    const agentSignature = agentCanvasRef.current?.toDataURL() || null;

    const payload = {
      booking_id: bookingId,
      vehicle_id: selectedVehicle.id,
      type,
      fuel_level: fuelLevel,
      mileage_km: parseInt(mileage, 10),
      cleanliness,
      damage_marks: [], // Simplified for this demo
      notes,
      client_signature: clientSignature,
      agent_signature: agentSignature,
    };

    try {
      if (isOnline) {
        // Direct mutation when online
        const result = await createInspection(payload);
        if (result.error) throw new Error(result.error);
      } else {
        // Queue for offline sync
        await queueForSync("inspection", "create", payload);
      }
      onComplete();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement de l'inspection.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isOnline && (
        <div className="p-4 rounded-xl text-sm bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] font-medium flex items-center gap-2">
          <span className="shrink-0">⚠️</span> Mode hors ligne : L'inspection sera sauvegardée localement et synchronisée plus tard.
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] font-medium flex items-center gap-2">
           <span className="shrink-0">⚠️</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-[#a1a1aa]">
            Réservation *
          </Label>
          <select
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] text-[#fafafa] rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none"
            required
          >
            <option value="" className="bg-[#131316]">Sélectionner une réservation...</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id} className="bg-[#131316]">
                {b.booking_ref} - {b.client?.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-[#a1a1aa]">
            Type d'inspection *
          </Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "check_in" | "check_out")}
            className="w-full bg-white/[0.03] border border-white/[0.08] text-[#fafafa] rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none"
            required
          >
            <option value="check_in" className="bg-[#131316]">Départ (Check-in)</option>
            <option value="check_out" className="bg-[#131316]">Retour (Check-out)</option>
          </select>
        </div>
      </div>

      {selectedVehicle && (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-[#71717a] mb-1">
            Véhicule sélectionné
          </h4>
          <p className="text-sm font-medium text-[#fafafa]">
            {selectedVehicle.brand} {selectedVehicle.model} <span className="text-[#a1a1aa] font-normal ml-1">({selectedVehicle.plate_number})</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-[#a1a1aa]">
            Kilométrage actuel (km) *
          </Label>
          <Input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder={selectedVehicle?.mileage_km?.toString() || "0"}
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-[#a1a1aa]">
            Propreté
          </Label>
          <select
            value={cleanliness}
            onChange={(e) => setCleanliness(e.target.value as "clean" | "average" | "dirty")}
            className="w-full bg-white/[0.03] border border-white/[0.08] text-[#fafafa] rounded-xl h-11 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none"
          >
            <option value="clean" className="bg-[#131316]">Propre</option>
            <option value="average" className="bg-[#131316]">Moyen</option>
            <option value="dirty" className="bg-[#131316]">Sale</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-semibold text-[#a1a1aa]">
          Niveau de carburant ({fuelLevel}/8) *
        </Label>
        <input
          type="range"
          min="0"
          max="8"
          value={fuelLevel}
          onChange={(e) => setFuelLevel(parseInt(e.target.value, 10))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/[0.08] accent-white"
        />
        <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-[#71717a]">
          <span>Vide</span>
          <span>1/4</span>
          <span>1/2</span>
          <span>3/4</span>
          <span>Plein</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-[#a1a1aa]">
          Notes et observations
        </Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="flex min-h-[80px] w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-[#fafafa] shadow-xs transition-colors placeholder:text-[#71717a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
          placeholder="Rayures, remarques..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <Label className="text-xs font-semibold text-[#a1a1aa]">
              Signature Client
            </Label>
            <button
              type="button"
              onClick={() => clearCanvas(clientCanvasRef)}
              className="text-[11px] text-[#3b82f6] hover:text-[#60a5fa] font-medium"
            >
              Effacer
            </button>
          </div>
          <div className="rounded-xl border border-white/[0.12] bg-[#fafafa] overflow-hidden touch-none shadow-inner">
            <canvas
              ref={clientCanvasRef}
              width={400}
              height={150}
              className="w-full h-[150px] cursor-crosshair"
              onMouseDown={(e) => startDrawing(e, clientCanvasRef, setIsDrawingClient)}
              onMouseMove={(e) => draw(e, clientCanvasRef, isDrawingClient)}
              onMouseUp={() => stopDrawing(setIsDrawingClient)}
              onMouseOut={() => stopDrawing(setIsDrawingClient)}
              onTouchStart={(e) => startDrawing(e, clientCanvasRef, setIsDrawingClient)}
              onTouchMove={(e) => draw(e, clientCanvasRef, isDrawingClient)}
              onTouchEnd={() => stopDrawing(setIsDrawingClient)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <Label className="text-xs font-semibold text-[#a1a1aa]">
              Signature Agent
            </Label>
            <button
              type="button"
              onClick={() => clearCanvas(agentCanvasRef)}
              className="text-[11px] text-[#3b82f6] hover:text-[#60a5fa] font-medium"
            >
              Effacer
            </button>
          </div>
          <div className="rounded-xl border border-white/[0.12] bg-[#fafafa] overflow-hidden touch-none shadow-inner">
            <canvas
              ref={agentCanvasRef}
              width={400}
              height={150}
              className="w-full h-[150px] cursor-crosshair"
              onMouseDown={(e) => startDrawing(e, agentCanvasRef, setIsDrawingAgent)}
              onMouseMove={(e) => draw(e, agentCanvasRef, isDrawingAgent)}
              onMouseUp={() => stopDrawing(setIsDrawingAgent)}
              onMouseOut={() => stopDrawing(setIsDrawingAgent)}
              onTouchStart={(e) => startDrawing(e, agentCanvasRef, setIsDrawingAgent)}
              onTouchMove={(e) => draw(e, agentCanvasRef, isDrawingAgent)}
              onTouchEnd={() => stopDrawing(setIsDrawingAgent)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-white/[0.08]">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel} 
          disabled={isSubmitting}
          className="h-11 rounded-xl text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.04]"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#fafafa] hover:bg-white text-black font-semibold h-11 px-6 rounded-xl shadow-xs"
        >
          {isSubmitting ? "Enregistrement..." : isOnline ? "Enregistrer" : "Enregistrer hors ligne"}
        </Button>
      </div>
    </form>
  );
}
