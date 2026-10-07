"use client";

import { useState, useEffect } from "react";
import { formatMAD, formatDateMA } from "@/lib/utils";
import { queueForSync } from "@/lib/offline-store";
import { InspectionForm } from "./inspection-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck, Plus, Wifi, WifiOff, RefreshCw, 
  ArrowRightLeft, AlertCircle, Smartphone, CheckCircle2, PenTool 
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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            États des Lieux (Inspections PWA)
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
            <span className="text-xs sm:text-sm text-white/50">
              {inspections.length} inspection{inspections.length !== 1 ? "s" : ""}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            {/* Apple Status Badges */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              isOnline
                ? "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/25"
                : "bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/25"
            }`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? "En ligne" : "Hors ligne (PWA)"}
            </span>
            {pendingSyncs > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ffd60a]/15 text-[#ffd60a] border border-[#ffd60a]/25">
                <RefreshCw className="w-3 h-3 animate-spin" />
                {pendingSyncs} en attente
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl shadow-xs active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Nouvel état des lieux
        </Button>
      </div>

      {showForm ? (
        <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.08] shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Nouvelle Inspection Véhicule</h2>
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
        <div className="p-4 rounded-2xl bg-[#ffd60a]/10 border border-[#ffd60a]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ffd60a] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#ffd60a] mb-0.5">
                Mode hors ligne activé
              </h3>
              <p className="text-xs text-[#ffd60a]/80">
                Vous pouvez réaliser vos états des lieux dans les parkings souterrains. Les signatures et dégâts seront synchronisés dès le retour de la connexion réseau.
              </p>
            </div>
          </div>
          {pendingSyncs > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-[#ffd60a]/30 text-[#ffd60a] hover:bg-[#ffd60a]/10 rounded-xl text-xs shrink-0"
              onClick={() => {
                if (isOnline && "serviceWorker" in navigator) {
                  navigator.serviceWorker.ready.then(reg => {
                    // @ts-ignore
                    reg.sync.register("location-voiture-sync");
                  });
                }
              }}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Forcer la synchronisation
            </Button>
          )}
        </div>
      )}

      {inspections.length === 0 ? (
        <div className="rounded-3xl bg-[#1c1c1e] border border-white/[0.08] border-dashed p-12 text-center">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white/40">
            <Smartphone className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Aucun état des lieux enregistré</h3>
          <p className="text-xs text-white/40 max-w-md mx-auto">
            Les inspections fonctionnent hors-ligne sur smartphone et tablette même sans réseau (Service Worker & IndexedDB).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {inspections.map((inspection) => (
            <div
              key={inspection.id}
              className="rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm hover:border-white/20 transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                    inspection.type === "check_in" 
                      ? "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/25" 
                      : "bg-[#0a84ff]/15 text-[#0a84ff] border-[#0a84ff]/25"
                  }`}>
                    {inspection.type === "check_in" ? <ArrowRightLeft className="w-3 h-3 rotate-180" /> : <ArrowRightLeft className="w-3 h-3" />}
                    {inspection.type === "check_in" ? "Départ (Check-in)" : "Retour (Check-out)"}
                  </span>
                  <span className="text-xs text-white/40 font-medium">
                    {formatDateMA(inspection.created_at)}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-white text-base truncate">
                    {inspection.vehicle?.brand} {inspection.vehicle?.model}
                  </h3>
                  <p className="text-xs font-mono text-white/40 mt-0.5">
                    Contrat: {inspection.booking?.booking_ref || "—"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <div>
                    <span className="block text-[10px] font-medium text-white/40 uppercase tracking-wider mb-0.5">Kilométrage</span>
                    <span className="text-white font-semibold">{inspection.mileage_km.toLocaleString("fr-MA")} km</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-medium text-white/40 uppercase tracking-wider mb-0.5">Carburant</span>
                    <span className="text-white font-semibold">{inspection.fuel_level}/8</span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-black/30 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
                <span className="truncate max-w-[150px]">
                  Par: {inspection.inspector?.full_name || "Agent"}
                </span>
                <div className="flex gap-2">
                  {inspection.client_signature && (
                    <span title="Signature client">
                      <PenTool className="w-3.5 h-3.5 text-[#30d158]" />
                    </span>
                  )}
                  {(inspection.damage_marks?.length ?? 0) > 0 && (
                    <span title="Dommages signalés">
                      <AlertCircle className="w-3.5 h-3.5 text-[#ffd60a]" />
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
