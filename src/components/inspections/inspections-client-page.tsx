"use client";

import { useState, useEffect } from "react";
import { formatMAD, formatDateMA } from "@/lib/utils";
import { queueForSync } from "@/lib/offline-store";
import { InspectionForm } from "./inspection-form";

export function InspectionsClientPage({ 
  initialInspections, 
  vehicles, 
  bookings 
}: { 
  initialInspections: any[], 
  vehicles: any[], 
  bookings: any[] 
}) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const [inspections, setInspections] = useState(initialInspections);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check IndexedDB for pending syncs (requires dexie-react-hooks in a real app, simplified here)
    const checkQueue = async () => {
      const { db } = await import("@/lib/offline-store");
      const count = await db.syncQueue.count();
      setPendingSyncs(count);
    };
    checkQueue();
    
    const interval = setInterval(checkQueue, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            État des Lieux (Inspections)
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {inspections.length} inspection{inspections.length !== 1 ? "s" : ""}
            </p>
            {/* Offline Status Badge */}
            <span
              className="badge"
              style={{
                background: isOnline ? "rgba(5, 150, 105, 0.1)" : "rgba(220, 38, 38, 0.1)",
                color: isOnline ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {isOnline ? "🟢 En ligne" : "🔴 Hors ligne"}
            </span>
            {pendingSyncs > 0 && (
              <span className="badge badge-warning">
                ⏳ {pendingSyncs} en attente de synchro
              </span>
            )}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Nouvel état des lieux</button>
      </div>

      {showForm ? (
        <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 className="text-xl font-bold mb-6">Nouvelle Inspection</h2>
          <InspectionForm
            vehicles={vehicles}
            bookings={bookings}
            onCancel={() => setShowForm(false)}
            onComplete={() => {
              setShowForm(false);
              // In a real app, we'd refetch or optimistically update the list here
              window.location.reload();
            }}
          />
        </div>
      ) : null}

      {!isOnline && !showForm && (
        <div
          className="mb-6 p-4 rounded-lg flex items-center justify-between"
          style={{
            background: "rgba(217, 119, 6, 0.1)",
            border: "1px solid var(--color-warning)",
          }}
        >
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-warning)" }}>
              Mode hors ligne activé
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Vous pouvez continuer à effectuer des inspections. Elles seront synchronisées automatiquement dès le retour de la connexion (Background Sync).
            </p>
          </div>
          {pendingSyncs > 0 && (
            <button
              className="btn btn-ghost text-xs"
              onClick={() => {
                if (isOnline && "serviceWorker" in navigator) {
                  navigator.serviceWorker.ready.then(reg => {
                    // @ts-ignore
                    reg.sync.register("location-voiture-sync");
                  });
                }
              }}
            >
              Forcer la synchro
            </button>
          )}
        </div>
      )}

      {inspections.length === 0 ? (
        <div className="card">
          <div className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
            <p className="text-5xl mb-4">📱</p>
            <p className="text-lg font-medium mb-2">Aucun état des lieux</p>
            <p className="text-sm max-w-md mx-auto">
              Les inspections fonctionnent même sans connexion internet dans les parkings souterrains.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inspections.map((inspection) => (
            <div key={inspection.id} className="card animate-fade-in" style={{ padding: "1.25rem" }}>
              <div className="flex items-start justify-between mb-3">
                <span
                  className="badge"
                  style={{
                    background: inspection.type === "check_in" ? "rgba(5, 150, 105, 0.1)" : "rgba(59, 130, 246, 0.1)",
                    color: inspection.type === "check_in" ? "var(--color-success)" : "var(--color-primary)",
                  }}
                >
                  {inspection.type === "check_in" ? "Départ (Check-in)" : "Retour (Check-out)"}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {formatDateMA(inspection.created_at)}
                </span>
              </div>

              <h3 className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                {inspection.vehicle?.brand} {inspection.vehicle?.model}
              </h3>
              <p className="text-xs font-mono mb-3" style={{ color: "var(--color-text-muted)" }}>
                Réf: {inspection.booking?.booking_ref}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
                <div>
                  <span className="block text-xs opacity-70">Kilométrage</span>
                  {inspection.mileage_km.toLocaleString("fr-MA")} km
                </div>
                <div>
                  <span className="block text-xs opacity-70">Carburant</span>
                  {inspection.fuel_level}/8
                </div>
              </div>

              <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--color-border)" }}>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Par: {inspection.inspector?.full_name}
                </span>
                <div className="flex gap-1">
                  {inspection.client_signature && (
                    <span title="Signature client" className="text-lg">✍️</span>
                  )}
                  {(inspection.damage_marks?.length ?? 0) > 0 && (
                    <span title="Dommages signalés" className="text-lg">⚠️</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
