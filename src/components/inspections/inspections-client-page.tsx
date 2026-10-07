"use client";

import { useState, useEffect } from "react";
import { formatMAD, formatDateMA } from "@/lib/utils";
import { queueForSync } from "@/lib/offline-store";
import { InspectionForm } from "./inspection-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Smartphone, Wifi, WifiOff, AlertCircle, RefreshCw, PenTool, CheckCircle, ArrowRightLeft } from "lucide-react";

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
      try {
        const { db } = await import("@/lib/offline-store");
        const count = await db.syncQueue.count();
        setPendingSyncs(count);
      } catch (e) {
        // ignore errors if db not initialized
      }
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            État des Lieux (Inspections)
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-slate-400">
              {inspections.length} inspection{inspections.length !== 1 ? "s" : ""}
            </p>
            {/* Offline Status Badge */}
            <Badge 
              variant="outline" 
              className={`gap-1.5 ${isOnline ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? "En ligne" : "Hors ligne"}
            </Badge>
            {pendingSyncs > 0 && (
              <Badge variant="outline" className="gap-1.5 bg-amber-500/10 text-amber-500 border-amber-500/20">
                <RefreshCw className="w-3 h-3 animate-spin" />
                {pendingSyncs} en attente
              </Badge>
            )}
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel état des lieux
        </Button>
      </div>

      {showForm ? (
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-100">Nouvelle Inspection</h2>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      ) : null}

      {!isOnline && !showForm && (
        <Card className="bg-amber-500/10 border-amber-500/20 shadow-none">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-500 mb-1">
                  Mode hors ligne activé
                </h3>
                <p className="text-sm text-amber-500/80">
                  Vous pouvez continuer à effectuer des inspections. Elles seront synchronisées automatiquement dès le retour de la connexion (Background Sync).
                </p>
              </div>
            </div>
            {pendingSyncs > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 shrink-0"
                onClick={() => {
                  if (isOnline && "serviceWorker" in navigator) {
                    navigator.serviceWorker.ready.then(reg => {
                      // @ts-ignore
                      reg.sync.register("location-voiture-sync");
                    });
                  }
                }}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Forcer la synchro
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {inspections.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">Aucun état des lieux</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Les inspections fonctionnent même sans connexion internet dans les parkings souterrains.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {inspections.map((inspection) => (
            <Card key={inspection.id} className="bg-slate-950 border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 transition-all flex flex-col">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <Badge 
                    variant="outline" 
                    className={`gap-1.5 px-2 py-0.5 border-0 ${
                      inspection.type === "check_in" 
                        ? "bg-emerald-500/10 text-emerald-500" 
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {inspection.type === "check_in" ? <ArrowRightLeft className="w-3 h-3 rotate-180" /> : <ArrowRightLeft className="w-3 h-3" />}
                    {inspection.type === "check_in" ? "Départ (Check-in)" : "Retour (Check-out)"}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatDateMA(inspection.created_at)}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-2 flex-1">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-100 text-lg truncate">
                    {inspection.vehicle?.brand} {inspection.vehicle?.model}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    Réf: {inspection.booking?.booking_ref}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm p-3 bg-slate-900/50 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="block text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">Kilométrage</span>
                    <span className="text-slate-200 font-semibold">{inspection.mileage_km.toLocaleString("fr-MA")} km</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">Carburant</span>
                    <span className="text-slate-200 font-semibold">{inspection.fuel_level}/8</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-3 px-4 bg-slate-900/30 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate max-w-[150px]">
                  Par: {inspection.inspector?.full_name}
                </span>
                <div className="flex gap-2">
                  {inspection.client_signature && (
                    <span title="Signature client">
                      <PenTool className="w-4 h-4 text-emerald-500" />
                    </span>
                  )}
                  {(inspection.damage_marks?.length ?? 0) > 0 && (
                    <span title="Dommages signalés">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    </span>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
