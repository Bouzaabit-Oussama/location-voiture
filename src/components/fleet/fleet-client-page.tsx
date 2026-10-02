"use client";

import { useState } from "react";
import { AddVehicleModal } from "@/components/fleet/add-vehicle-modal";
import { formatMAD } from "@/lib/utils";
import type { Vehicle } from "@/types";

interface FleetClientPageProps {
  initialVehicles: Vehicle[];
  compliance: {
    total: number;
    compliant: boolean;
    issues: string[];
  };
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  available: { label: "Disponible", class: "badge-success" },
  rented: { label: "En location", class: "badge-info" },
  maintenance: { label: "Maintenance", class: "badge-warning" },
  reserved: { label: "Réservé", class: "badge-neutral" },
  decommissioned: { label: "Retiré", class: "badge-danger" },
};

export function FleetClientPage({ initialVehicles, compliance }: FleetClientPageProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const vehicles = initialVehicles;
  const filtered = filter === "all"
    ? vehicles
    : vehicles.filter((v) => v.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Gestion de la flotte
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {compliance.total} véhicule{compliance.total !== 1 ? "s" : ""} enregistré{compliance.total !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          + Ajouter un véhicule
        </button>
      </div>

      {/* Compliance Alert */}
      {!compliance.compliant && compliance.issues.length > 0 && (
        <div
          className="mb-6 p-4 rounded-lg"
          style={{
            background: "rgba(217, 119, 6, 0.1)",
            border: "1px solid var(--color-warning)",
          }}
        >
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--color-warning)" }}>
            ⚠️ Alertes de conformité
          </h3>
          <ul className="space-y-1">
            {compliance.issues.map((issue, i) => (
              <li key={i} className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                • {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: "all", label: "Tous" },
          { value: "available", label: "Disponibles" },
          { value: "rented", label: "En location" },
          { value: "maintenance", label: "Maintenance" },
          { value: "reserved", label: "Réservés" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className="btn"
            style={{
              background: filter === tab.value ? "var(--color-primary)" : "transparent",
              color: filter === tab.value ? "white" : "var(--color-text-muted)",
              border: `1px solid ${filter === tab.value ? "var(--color-primary)" : "var(--color-border)"}`,
              padding: "0.375rem 1rem",
              fontSize: "0.8125rem",
            }}
          >
            {tab.label}
            {tab.value === "all" && ` (${vehicles.length})`}
            {tab.value !== "all" && ` (${vehicles.filter((v) => v.status === tab.value).length})`}
          </button>
        ))}
      </div>

      {/* Vehicle Grid */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
            <p className="text-5xl mb-4">🚗</p>
            <p className="text-lg font-medium mb-2">
              {vehicles.length === 0
                ? "Aucun véhicule enregistré"
                : "Aucun véhicule dans cette catégorie"}
            </p>
            <p className="text-sm max-w-md mx-auto mb-6">
              {vehicles.length === 0
                ? "Ajoutez vos véhicules pour commencer. Minimum 7 requis par le Ministère du Transport."
                : "Essayez un autre filtre."}
            </p>
            {vehicles.length === 0 && (
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                Ajouter votre premier véhicule
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((vehicle) => {
            const statusInfo = STATUS_LABELS[vehicle.status] || STATUS_LABELS.available;
            const isExpiringSoon = (dateStr: string | null) => {
              if (!dateStr) return false;
              const d = new Date(dateStr);
              const now = new Date();
              const diffDays = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
              return diffDays <= 30 && diffDays > 0;
            };
            const isExpired = (dateStr: string | null) => {
              if (!dateStr) return false;
              return new Date(dateStr) < new Date();
            };

            return (
              <div
                key={vehicle.id}
                className="card animate-fade-in"
                style={{ padding: "1.25rem" }}
              >
                {/* Header: Plate + Status */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-sm font-mono font-bold px-2 py-1 rounded"
                    style={{
                      background: "var(--color-bg)",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {vehicle.plate_number}
                  </span>
                  <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
                </div>

                {/* Vehicle Info */}
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
                  {vehicle.year} • {vehicle.fuel_type === "diesel" ? "Diesel" : vehicle.fuel_type === "gasoline" ? "Essence" : vehicle.fuel_type}
                  {" "}• {vehicle.transmission === "manual" ? "Manuelle" : "Auto"} • {vehicle.seats} places
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                    {formatMAD(vehicle.daily_rate_mad)}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    / jour
                  </span>
                </div>

                {/* Document Status Indicators */}
                <div className="flex gap-2 text-xs">
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      background: isExpired(vehicle.insurance_expiry)
                        ? "rgba(220, 38, 38, 0.1)"
                        : isExpiringSoon(vehicle.insurance_expiry)
                        ? "rgba(217, 119, 6, 0.1)"
                        : "rgba(5, 150, 105, 0.1)",
                      color: isExpired(vehicle.insurance_expiry)
                        ? "var(--color-danger)"
                        : isExpiringSoon(vehicle.insurance_expiry)
                        ? "var(--color-warning)"
                        : "var(--color-success)",
                    }}
                  >
                    Assurance
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      background: isExpired(vehicle.technical_visit_expiry)
                        ? "rgba(220, 38, 38, 0.1)"
                        : isExpiringSoon(vehicle.technical_visit_expiry)
                        ? "rgba(217, 119, 6, 0.1)"
                        : "rgba(5, 150, 105, 0.1)",
                      color: isExpired(vehicle.technical_visit_expiry)
                        ? "var(--color-danger)"
                        : isExpiringSoon(vehicle.technical_visit_expiry)
                        ? "var(--color-warning)"
                        : "var(--color-success)",
                    }}
                  >
                    Visite tech.
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      background: isExpired(vehicle.vignette_expiry)
                        ? "rgba(220, 38, 38, 0.1)"
                        : isExpiringSoon(vehicle.vignette_expiry)
                        ? "rgba(217, 119, 6, 0.1)"
                        : "rgba(5, 150, 105, 0.1)",
                      color: isExpired(vehicle.vignette_expiry)
                        ? "var(--color-danger)"
                        : isExpiringSoon(vehicle.vignette_expiry)
                        ? "var(--color-warning)"
                        : "var(--color-success)",
                    }}
                  >
                    Vignette
                  </span>
                </div>

                {/* Mileage */}
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    🔧 {vehicle.mileage_km.toLocaleString("fr-MA")} km
                    {vehicle.gps_device_imei && " • 📡 GPS actif"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
