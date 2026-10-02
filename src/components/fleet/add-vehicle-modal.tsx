"use client";

import { useActionState, useState } from "react";
import { addVehicle, type FleetActionState } from "@/app/actions/fleet";

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

  if (!isOpen) return null;

  if (state.success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="card animate-fade-in text-center" style={{ padding: "2rem", maxWidth: "400px" }}>
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
            Véhicule ajouté !
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            Le véhicule a été ajouté à votre flotte.
          </p>
          <button onClick={onClose} className="btn btn-primary">
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div
        className="card animate-fade-in w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ padding: "2rem" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
            Ajouter un véhicule
          </h2>
          <button onClick={onClose} className="btn btn-ghost" aria-label="Fermer">
            ✕
          </button>
        </div>

        {state.error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: "var(--color-danger)", color: "white" }}
          >
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Row 1: Plate + Brand + Model */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="plate_number" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Immatriculation *
              </label>
              <input
                id="plate_number"
                name="plate_number"
                type="text"
                placeholder="12345-A-67"
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Marque *
              </label>
              <select id="brand" name="brand" className="input" required>
                <option value="">Choisir...</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Modèle *
              </label>
              <input id="model" name="model" type="text" placeholder="Logan" className="input" required />
            </div>
          </div>

          {/* Row 2: Year + Category + Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Année *
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min={new Date().getFullYear() - 5}
                max={new Date().getFullYear() + 1}
                placeholder={String(new Date().getFullYear())}
                className="input"
                required
              />
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                Max 5 ans (Ministère du Transport)
              </p>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Catégorie
              </label>
              <select id="category" name="category" className="input">
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="color" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Couleur
              </label>
              <input id="color" name="color" type="text" placeholder="Blanc" className="input" />
            </div>
          </div>

          {/* Row 3: Fuel + Transmission + Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="fuel_type" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Carburant
              </label>
              <select id="fuel_type" name="fuel_type" className="input">
                <option value="diesel">Diesel</option>
                <option value="gasoline">Essence</option>
                <option value="hybrid">Hybride</option>
                <option value="electric">Électrique</option>
              </select>
            </div>
            <div>
              <label htmlFor="transmission" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Transmission
              </label>
              <select id="transmission" name="transmission" className="input">
                <option value="manual">Manuelle</option>
                <option value="automatic">Automatique</option>
              </select>
            </div>
            <div>
              <label htmlFor="seats" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Places
              </label>
              <input id="seats" name="seats" type="number" min={2} max={9} defaultValue={5} className="input" />
            </div>
          </div>

          {/* Row 4: Daily Rate + Mileage + VIN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="daily_rate_mad" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Tarif journalier (MAD) *
              </label>
              <input
                id="daily_rate_mad"
                name="daily_rate_mad"
                type="number"
                min={0}
                step={10}
                placeholder="250"
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="mileage_km" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Kilométrage
              </label>
              <input id="mileage_km" name="mileage_km" type="number" min={0} placeholder="0" className="input" />
            </div>
            <div>
              <label htmlFor="vin" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                VIN / Châssis
              </label>
              <input id="vin" name="vin" type="text" placeholder="Optionnel" className="input" />
            </div>
          </div>

          {/* Row 5: Document Expiries */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="insurance_expiry" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Assurance expire le
              </label>
              <input id="insurance_expiry" name="insurance_expiry" type="date" className="input" />
            </div>
            <div>
              <label htmlFor="technical_visit_expiry" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Visite technique expire le
              </label>
              <input id="technical_visit_expiry" name="technical_visit_expiry" type="date" className="input" />
            </div>
            <div>
              <label htmlFor="vignette_expiry" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Vignette expire le
              </label>
              <input id="vignette_expiry" name="vignette_expiry" type="date" className="input" />
            </div>
          </div>

          {/* GPS Device */}
          <div>
            <label htmlFor="gps_device_imei" className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
              IMEI GPS (Teltonika)
            </label>
            <input id="gps_device_imei" name="gps_device_imei" type="text" placeholder="Optionnel — pour le suivi IoT" className="input" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary"
              style={{ opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? "Ajout en cours..." : "Ajouter le véhicule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
