"use client";

import { useState } from "react";
import { AddVehicleModal } from "@/components/fleet/add-vehicle-modal";
import { formatMAD } from "@/lib/utils";
import type { Vehicle } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  Plus, 
  CarFront, 
  Wrench, 
  CalendarClock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search,
  MoreHorizontal,
  Navigation
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface FleetClientPageProps {
  initialVehicles: Vehicle[];
  compliance: {
    total: number;
    compliant: boolean;
    issues: string[];
  };
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  available: { label: "Disponible", icon: CheckCircle2, color: "#22c55e" },
  rented: { label: "En location", icon: CarFront, color: "#3b82f6" },
  maintenance: { label: "Maintenance", icon: Wrench, color: "#f59e0b" },
  reserved: { label: "Réservé", icon: CalendarClock, color: "#8b5cf6" },
  decommissioned: { label: "Retiré", icon: XCircle, color: "#ef4444" },
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
    <div className="space-y-6 sm:space-y-8 lx-animate-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#fafafa]">
            Flotte de véhicules
          </h1>
          <p className="text-sm text-[#71717a] mt-1">
            {compliance.total} véhicule{compliance.total !== 1 ? "s" : ""} enregistré{compliance.total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className={buttonVariants({
            size: "sm",
            className:
              "bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all h-10 px-5",
          })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      {/* ─── Compliance Alert ─── */}
      {!compliance.compliant && compliance.issues.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-start gap-3 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f59e0b]/50 to-transparent" />
          <ShieldAlert className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" strokeWidth={1.75} />
          <div>
            <h3 className="text-sm font-semibold text-[#f59e0b] mb-1.5">
              Alertes de conformité Ministère du Transport
            </h3>
            <ul className="space-y-1.5">
              {compliance.issues.map((issue, i) => (
                <li key={i} className="text-xs text-[#f59e0b]/80 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#f59e0b]/50" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ─── Filters and Search ─── */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Segmented Control */}
        <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-[#131316] border border-white/[0.08]">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                  isActive
                    ? "bg-white/[0.08] text-[#fafafa] shadow-sm"
                    : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.04]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md leading-none ${
                  isActive ? "bg-white/10 text-[#fafafa]" : "bg-white/[0.04] text-[#71717a]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a] pointer-events-none" />
          <Input
            type="text"
            placeholder="Rechercher marque, matricule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-[#131316] border-white/[0.08] text-[#fafafa] placeholder:text-[#4e4e56] rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 w-full transition-all"
          />
        </div>
      </div>

      {/* ─── Vehicle Grid ─── */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-[#131316] border border-white/[0.08] border-dashed p-12 text-center">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#71717a]">
            <CarFront className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-[#fafafa] mb-1">
            {vehicles.length === 0
              ? "Aucun véhicule enregistré"
              : "Aucun résultat trouvé"}
          </h3>
          <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto mb-6 leading-relaxed">
            {vehicles.length === 0
              ? "Ajoutez vos véhicules pour commencer l'exploitation. (Règle des 5 ans max au Maroc)."
              : "Modifiez vos filtres pour afficher vos véhicules."}
          </p>
          {vehicles.length === 0 && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-sm h-10 px-6 active:scale-[0.98] shadow-xs"
            >
              Ajouter votre premier véhicule
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lx-stagger">
          {filtered.map((vehicle) => {
            const statusInfo = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.available;
            
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

            const getDocStatusStyle = (dateStr: string | null) => {
              if (isExpired(dateStr)) return { color: "#ef4444", label: "Expirée" };
              if (isExpiringSoon(dateStr)) return { color: "#f59e0b", label: "Bientôt" };
              return { color: "#22c55e", label: "À jour" };
            };

            return (
              <div
                key={vehicle.id}
                className="group relative p-5 rounded-2xl bg-[#131316] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col"
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
                }}
              >
                {/* Accent Glow */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-40 transition-opacity duration-300 group-hover:opacity-80"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${statusInfo.color}40, transparent)`,
                  }}
                />

                {/* Top: Plate & Menu */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[#fafafa] font-semibold tracking-wider">
                    {vehicle.plate_number}
                  </span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.06] text-[#71717a] hover:text-[#fafafa] transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#fafafa] truncate mb-1">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#71717a] font-medium">
                    <span>{vehicle.year}</span>
                    <span className="w-1 h-1 rounded-full bg-white/[0.12]" />
                    <span className="capitalize">{vehicle.fuel_type === "gasoline" ? "Essence" : vehicle.fuel_type}</span>
                    <span className="w-1 h-1 rounded-full bg-white/[0.12]" />
                    <span className="capitalize">{vehicle.transmission === "manual" ? "Manuelle" : "Auto"}</span>
                  </div>

                  {/* Price & Status */}
                  <div className="flex items-end justify-between mt-6 pt-5 border-t border-white/[0.04]">
                    <div>
                      <span className="text-2xl font-bold tracking-tight text-[#fafafa]">
                        {formatMAD(vehicle.daily_rate_mad).replace('MAD', '').trim()}
                      </span>
                      <span className="text-[11px] text-[#71717a] ml-1 font-medium">MAD / j</span>
                    </div>

                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: `${statusInfo.color}12`,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.color}25`,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusInfo.color }} />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-3 gap-2 mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  {[
                    { label: "Assurance", expiry: vehicle.insurance_expiry },
                    { label: "Visite", expiry: vehicle.technical_visit_expiry },
                    { label: "Vignette", expiry: vehicle.vignette_expiry },
                  ].map((doc, i) => {
                    const status = getDocStatusStyle(doc.expiry);
                    return (
                      <div key={i} className="text-center space-y-1">
                        <div className="text-[10px] text-[#71717a] font-medium">{doc.label}</div>
                        <div
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block w-full max-w-[50px] truncate"
                          style={{
                            color: status.color,
                            background: `${status.color}15`,
                            border: `1px solid ${status.color}20`,
                          }}
                        >
                          {status.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between mt-4 text-[11px] font-medium text-[#71717a]">
                  <div className="flex items-center gap-1.5">
                    <CarFront className="w-3.5 h-3.5" strokeWidth={1.75} />
                    {vehicle.mileage_km.toLocaleString("fr-MA")} km
                  </div>
                  {vehicle.gps_device_imei && (
                    <div className="flex items-center gap-1.5 text-[#22c55e]">
                      <Navigation className="w-3.5 h-3.5" strokeWidth={1.75} />
                      GPS Actif
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddVehicleModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
