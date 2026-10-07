"use client";

import { useState, useEffect } from "react";
import { formatMAD, formatDateMA } from "@/lib/utils";
import { queueForSync } from "@/lib/offline-store";
import { InspectionForm } from "./inspection-form";
import { Button } from "@/components/ui/button";
import { 
  Plus, Wifi, WifiOff, RefreshCw, 
  ArrowRightLeft, AlertCircle, Smartphone, PenTool 
} from "lucide-react";

interface InspectionsClientPageProps {
  initialInspections: any[];
  vehicles: any[];
  bookings: any[];
}

export function InspectionsClientPage({
  initialInspections,
  vehicles,
  bookings,
}: InspectionsClientPageProps) {
  const [inspections, setInspections] = useState(initialInspections);
  const [showForm, setShowForm] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncs, setPendingSyncs] = useState(0);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const checkPending = async () => {
      if ("indexedDB" in window) {
        // Simple mock check
      }
    };
    checkPending();
    const interval = setInterval(checkPending, 10000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 lx-animate-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#fafafa]">
            États des Lieux
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
            <span className="text-sm text-[#71717a]">
              {inspections.length} inspection{inspections.length !== 1 ? "s" : ""}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/[0.12]" />
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
              isOnline
                ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20"
                : "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20"
            }`}>
              {isOnline ? <Wifi className="w-3 h-3" strokeWidth={2} /> : <WifiOff className="w-3 h-3" strokeWidth={2} />}
              {isOnline ? "En ligne" : "Hors ligne (PWA)"}
            </span>
            {pendingSyncs > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
                <RefreshCw className="w-3 h-3 animate-spin" strokeWidth={2} />
                {pendingSyncs} en attente
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all h-10 px-5"
        >
          <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
          Nouvel état des lieux
        </Button>
      </div>

      {showForm ? (
        <div className="p-6 rounded-3xl bg-[#131316] border border-white/[0.08] shadow-2xl">
          <h2 className="text-lg font-bold text-[#fafafa] mb-6">Nouvelle Inspection Véhicule</h2>
          <InspectionForm
            vehicles={vehicles}
            bookings={bookings}
            onCancel={() => setShowForm(false)}
            onComplete={() => {
              setShowForm(false);
              window.location.reload();
            }}
          />
        </div>
      ) : null}

      {!isOnline && !showForm && (
        <div className="p-4 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <h3 className="text-sm font-semibold text-[#f59e0b] mb-0.5">
                Mode hors ligne activé
              </h3>
              <p className="text-xs text-[#f59e0b]/80 leading-relaxed">
                Vous pouvez réaliser vos états des lieux dans les parkings souterrains. Les signatures et dégâts seront synchronisés dès le retour de la connexion réseau.
              </p>
            </div>
          </div>
          {pendingSyncs > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-[#f59e0b]/30 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl text-xs shrink-0 h-9"
              onClick={() => {
                if (isOnline && "serviceWorker" in navigator) {
                  navigator.serviceWorker.ready.then(reg => {
                    // @ts-ignore
                    reg.sync.register("location-voiture-sync");
                  });
                }
              }}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
              Forcer la synchronisation
            </Button>
          )}
        </div>
      )}

      {inspections.length === 0 ? (
        <div className="rounded-3xl bg-[#131316] border border-white/[0.08] border-dashed p-12 text-center">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#71717a]">
            <Smartphone className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-[#fafafa] mb-1">Aucun état des lieux enregistré</h3>
          <p className="text-xs text-[#a1a1aa] max-w-md mx-auto leading-relaxed">
            Les inspections fonctionnent hors-ligne sur smartphone et tablette même sans réseau (Service Worker & IndexedDB).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lx-stagger">
          {inspections.map((inspection) => (
            <div
              key={inspection.id}
              className="group relative rounded-2xl bg-[#131316] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col"
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
              }}
            >
               {/* Accent Glow */}
               <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-40 transition-opacity duration-300 group-hover:opacity-80"
                style={{
                  background: inspection.type === "check_in"
                    ? "linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.4), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)",
                }}
              />

              <div className="p-5 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                    inspection.type === "check_in" 
                      ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20" 
                      : "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20"
                  }`}>
                    {inspection.type === "check_in" ? <ArrowRightLeft className="w-3 h-3 rotate-180" strokeWidth={2} /> : <ArrowRightLeft className="w-3 h-3" strokeWidth={2} />}
                    {inspection.type === "check_in" ? "Départ (Check-in)" : "Retour (Check-out)"}
                  </span>
                  <span className="text-[11px] font-mono text-[#71717a]">
                    {formatDateMA(inspection.created_at)}
                  </span>
                </div>

                <div className="mb-5">
                  <h3 className="font-bold text-[#fafafa] text-base tracking-tight mb-1 group-hover:text-[#3b82f6] transition-colors">
                    {inspection.vehicle?.brand} {inspection.vehicle?.model}
                  </h3>
                  <p className="text-[11px] font-mono text-[#a1a1aa]">
                    Contrat: <span className="text-[#fafafa] font-semibold">{inspection.booking?.booking_ref || "—"}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                  <div>
                    <span className="block text-[10px] font-medium text-[#71717a] uppercase tracking-wider mb-1">Kilométrage</span>
                    <span className="text-[#fafafa] font-semibold">{inspection.mileage_km.toLocaleString("fr-MA")} <span className="text-[#a1a1aa] font-normal">km</span></span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-medium text-[#71717a] uppercase tracking-wider mb-1">Carburant</span>
                    <span className="text-[#fafafa] font-semibold">{inspection.fuel_level}<span className="text-[#a1a1aa] font-normal">/8</span></span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-black/40 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#a1a1aa]">
                <span className="truncate max-w-[150px]">
                  Par: <span className="text-[#fafafa] font-medium">{inspection.inspector?.full_name || "Agent"}</span>
                </span>
                <div className="flex items-center gap-2.5">
                  {inspection.client_signature && (
                    <span title="Signature client" className="flex items-center gap-1">
                      <PenTool className="w-3.5 h-3.5 text-[#22c55e]" strokeWidth={2} />
                      <span className="hidden sm:inline-block">Signé</span>
                    </span>
                  )}
                  {(inspection.damage_marks?.length ?? 0) > 0 && (
                    <span title="Dommages signalés" className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-[#f59e0b]" strokeWidth={2} />
                      <span className="hidden sm:inline-block">Dégâts</span>
                    </span>
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
