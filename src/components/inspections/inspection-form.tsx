"use client";

import { useState, useRef, useEffect } from "react";
import { queueForSync } from "@/lib/offline-store";
import { createInspection } from "@/app/actions/inspections";

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
        <div
          className="p-3 rounded-lg text-sm"
          style={{ background: "rgba(217, 119, 6, 0.1)", color: "var(--color-warning)", border: "1px solid var(--color-warning)" }}
        >
          ⚠️ Mode hors ligne : L&apos;inspection sera sauvegardée localement et synchronisée plus tard.
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ background: "var(--color-danger)", color: "white" }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            Réservation *
          </label>
          <select
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="input"
            required
          >
            <option value="">Sélectionner une réservation...</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.booking_ref} - {b.client?.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            Type d&apos;inspection *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "check_in" | "check_out")}
            className="input"
            required
          >
            <option value="check_in">Départ (Check-in)</option>
            <option value="check_out">Retour (Check-out)</option>
          </select>
        </div>
      </div>

      {selectedVehicle && (
        <div className="p-4 rounded-lg" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
          <h4 className="font-semibold text-sm mb-2" style={{ color: "var(--color-text)" }}>
            Véhicule
          </h4>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.plate_number})
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            Kilométrage actuel (km) *
          </label>
          <input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="input"
            placeholder={selectedVehicle?.mileage_km?.toString() || "0"}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            Propreté
          </label>
          <select
            value={cleanliness}
            onChange={(e) => setCleanliness(e.target.value as "clean" | "average" | "dirty")}
            className="input"
          >
            <option value="clean">Propre</option>
            <option value="average">Moyen</option>
            <option value="dirty">Sale</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
          Niveau de carburant ({fuelLevel}/8) *
        </label>
        <input
          type="range"
          min="0"
          max="8"
          value={fuelLevel}
          onChange={(e) => setFuelLevel(parseInt(e.target.value, 10))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{ background: "var(--color-border)" }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
          <span>Vide</span>
          <span>1/4</span>
          <span>1/2</span>
          <span>3/4</span>
          <span>Plein</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
          Notes et observations
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input min-h-[80px]"
          placeholder="Rayures, remarques..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-end mb-1">
            <label className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
              Signature Client
            </label>
            <button
              type="button"
              onClick={() => clearCanvas(clientCanvasRef)}
              className="text-xs"
              style={{ color: "var(--color-primary)" }}
            >
              Effacer
            </button>
          </div>
          <div
            className="rounded-lg touch-none"
            style={{ border: "1px solid var(--color-border)", background: "white" }}
          >
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

        <div>
          <div className="flex justify-between items-end mb-1">
            <label className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
              Signature Agent
            </label>
            <button
              type="button"
              onClick={() => clearCanvas(agentCanvasRef)}
              className="text-xs"
              style={{ color: "var(--color-primary)" }}
            >
              Effacer
            </button>
          </div>
          <div
            className="rounded-lg touch-none"
            style={{ border: "1px solid var(--color-border)", background: "white" }}
          >
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

      <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
        <button type="button" onClick={onCancel} className="btn btn-ghost" disabled={isSubmitting}>
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? "Enregistrement..." : isOnline ? "Enregistrer" : "Enregistrer hors ligne"}
        </button>
      </div>
    </form>
  );
}
