"use client";

import { useState } from "react";
import { AddVehicleModal } from "@/components/fleet/add-vehicle-modal";
import { formatMAD } from "@/lib/utils";
import type { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CarFront, Wrench, CalendarClock, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FleetClientPageProps {
  initialVehicles: Vehicle[];
  compliance: {
    total: number;
    compliant: boolean;
    issues: string[];
  };
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; badgeClass: string }> = {
  available: { label: "Disponible", icon: CheckCircle2, badgeClass: "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/25" },
  rented: { label: "En location", icon: CarFront, badgeClass: "bg-[#0a84ff]/15 text-[#0a84ff] border-[#0a84ff]/25" },
  maintenance: { label: "Maintenance", icon: Wrench, badgeClass: "bg-[#ffd60a]/15 text-[#ffd60a] border-[#ffd60a]/25" },
  reserved: { label: "Réservé", icon: CalendarClock, badgeClass: "bg-[#5e5ce6]/15 text-[#5e5ce6] border-[#5e5ce6]/25" },
  decommissioned: { label: "Retiré", icon: XCircle, badgeClass: "bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/25" },
};

export function FleetClientPage({ initialVehicles, compliance }: FleetClientPageProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const vehicles = initialVehicles;
  
  const filtered = vehicles.filter((v) => {
    const matchesFilter = filter === "all" || v.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      v.plate_number.toLowerCase().includes(searchLower) ||
      v.brand.toLowerCase().includes(searchLower) ||
      v.model.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Flotte de véhicules</h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            {compliance.total} véhicule{compliance.total !== 1 ? "s" : ""} enregistré{compliance.total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl shadow-xs active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Ajouter un véhicule
        </Button>
      </div>

      {/* Compliance Alert */}
      {!compliance.compliant && compliance.issues.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#ffd60a]/10 border border-[#ffd60a]/20">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#ffd60a] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#ffd60a] mb-1">
                Alertes de conformité Ministère du Transport
              </h3>
              <ul className="space-y-1">
                {compliance.issues.map((issue, i) => (
                  <li key={i} className="text-xs text-[#ffd60a]/90">
                    • {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Apple Segmented Control */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
          {[
            { value: "all", label: "Tous" },
            { value: "available", label: "Disponibles" },
            { value: "rented", label: "En location" },
            { value: "maintenance", label: "Maintenance" },
            { value: "reserved", label: "Réservés" },
          ].map((tab) => {
            const count = tab.value === "all" ? vehicles.length : vehicles.filter((v) => v.status === tab.value).length;
            const isActive = filter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                  isActive
                    ? "bg-white text-black font-semibold shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-black/10 text-black font-bold" : "bg-white/10 text-white/50"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <Input
            type="text"
            placeholder="Rechercher marque, matricule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-white/[0.05] border-white/10 text-white placeholder:text-white/35 rounded-xl text-xs focus-visible:ring-2 focus-visible:ring-[#0a84ff]/50 focus-visible:border-[#0a84ff] w-full"
          />
        </div>
      </div>

      {/* Vehicle Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-[#1c1c1e] border border-white/[0.08] border-dashed p-12 text-center">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white/40">
            <CarFront className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            {vehicles.length === 0
              ? "Aucun véhicule enregistré"
              : "Aucun résultat trouvé"}
          </h3>
          <p className="text-xs text-white/40 max-w-sm mx-auto mb-5">
            {vehicles.length === 0
              ? "Ajoutez vos véhicules pour commencer l'exploitation. Règle des 5 ans max au Maroc."
              : "Modifiez vos filtres pour afficher vos véhicules."}
          </p>
          {vehicles.length === 0 && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl text-xs active:scale-[0.98]"
            >
              Ajouter votre premier véhicule
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((vehicle) => {
            const statusInfo = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.available;
            const StatusIcon = statusInfo.icon;
            
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

            const getDocBadgeStyle = (dateStr: string | null) => {
              if (isExpired(dateStr)) return "bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/25";
              if (isExpiringSoon(dateStr)) return "bg-[#ffd60a]/15 text-[#ffd60a] border-[#ffd60a]/25";
              return "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/25";
            };

            return (
              <div
                key={vehicle.id}
                className="rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm hover:border-white/20 transition-all duration-200 group flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-xs px-2.5 py-1 bg-white/[0.06] border border-white/10 rounded-lg text-white font-semibold tracking-wider">
                      {vehicle.plate_number}
                    </span>
                    
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${statusInfo.badgeClass}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white truncate group-hover:text-[#0a84ff] transition-colors">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-xs text-white/40 mt-1 flex items-center gap-2">
                    <span>{vehicle.year}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{vehicle.fuel_type === "diesel" ? "Diesel" : vehicle.fuel_type === "gasoline" ? "Essence" : vehicle.fuel_type}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{vehicle.transmission === "manual" ? "Manuelle" : "Auto"}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-bold tracking-tight text-white">
                        {formatMAD(vehicle.daily_rate_mad).replace('MAD', '').trim()}
                      </span>
                      <span className="text-[11px] text-white/40 ml-1 font-medium">MAD / jour</span>
                    </div>
                  </div>

                  {/* Document Status */}
                  <div className="space-y-1.5 mt-4 pt-3 border-t border-white/[0.06]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 text-[11px]">Assurance</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full border ${getDocBadgeStyle(vehicle.insurance_expiry)}`}>
                        {isExpired(vehicle.insurance_expiry) ? 'Expirée' : isExpiringSoon(vehicle.insurance_expiry) ? 'Bientôt' : 'À jour'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 text-[11px]">Visite technique</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full border ${getDocBadgeStyle(vehicle.technical_visit_expiry)}`}>
                        {isExpired(vehicle.technical_visit_expiry) ? 'Expirée' : isExpiringSoon(vehicle.technical_visit_expiry) ? 'Bientôt' : 'À jour'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 text-[11px]">Vignette</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full border ${getDocBadgeStyle(vehicle.vignette_expiry)}`}>
                        {isExpired(vehicle.vignette_expiry) ? 'Expirée' : isExpiringSoon(vehicle.vignette_expiry) ? 'Bientôt' : 'À jour'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom / Footer */}
                <div className="px-5 py-3 bg-black/30 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CarFront className="w-3.5 h-3.5 text-white/50" />
                    {vehicle.mileage_km.toLocaleString("fr-MA")} km
                  </div>
                  {vehicle.gps_device_imei && (
                    <div className="flex items-center gap-1.5 text-[#30d158]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
                      GPS
                    </div>
                  )}
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
