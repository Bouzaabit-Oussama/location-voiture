"use client";

import { useState } from "react";
import { AddVehicleModal } from "@/components/fleet/add-vehicle-modal";
import { formatMAD } from "@/lib/utils";
import type { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  available: { label: "Disponible", icon: CheckCircle2 },
  rented: { label: "En location", icon: CarFront },
  maintenance: { label: "Maintenance", icon: Wrench },
  reserved: { label: "Réservé", icon: CalendarClock },
  decommissioned: { label: "Retiré", icon: XCircle },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Flotte de véhicules</h1>
          <p className="text-sm text-slate-400 mt-1">
            {compliance.total} véhicule{compliance.total !== 1 ? "s" : ""} enregistré{compliance.total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      {/* Compliance Alert */}
      {!compliance.compliant && compliance.issues.length > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/20 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-500 mb-1">
                  Alertes de conformité Ministère du Transport
                </h3>
                <ul className="space-y-1">
                  {compliance.issues.map((issue, i) => (
                    <li key={i} className="text-sm text-amber-500/80">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Tous" },
            { value: "available", label: "Disponibles" },
            { value: "rented", label: "En location" },
            { value: "maintenance", label: "Maintenance" },
            { value: "reserved", label: "Réservés" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={filter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.value)}
              className={filter === tab.value ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"}
            >
              {tab.label}
              <Badge 
                variant="secondary" 
                className={`ml-2 h-4 px-1 py-0 text-[10px] ${filter === tab.value ? "bg-slate-300/50 text-slate-900" : "bg-slate-800 text-slate-400"}`}
              >
                {tab.value === "all" ? vehicles.length : vehicles.filter((v) => v.status === tab.value).length}
              </Badge>
            </Button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text"
            placeholder="Rechercher (mat, modèle)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-slate-950 border-slate-800 text-sm focus-visible:ring-1 focus-visible:ring-blue-500/50 w-full"
          />
        </div>
      </div>

      {/* Vehicle Grid */}
      {filtered.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <CarFront className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">
              {vehicles.length === 0
                ? "Aucun véhicule enregistré"
                : "Aucun véhicule trouvé"}
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              {vehicles.length === 0
                ? "Ajoutez vos véhicules pour commencer. Minimum 7 requis par le Ministère du Transport."
                : "Essayez de modifier vos filtres ou votre recherche."}
            </p>
            {vehicles.length === 0 && (
              <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white">
                Ajouter votre premier véhicule
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              if (isExpired(dateStr)) return "bg-red-500/10 text-red-500 border-red-500/20";
              if (isExpiringSoon(dateStr)) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
              return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            };

            return (
              <Card key={vehicle.id} className="bg-slate-950 border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 transition-all group overflow-hidden flex flex-col">
                <CardHeader className="p-4 pb-2 space-y-0 relative">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="font-mono text-sm px-2 py-0.5 bg-slate-900 border-slate-700 text-slate-200">
                      {vehicle.plate_number}
                    </Badge>
                    
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium border-0
                        ${vehicle.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                        ${vehicle.status === 'rented' ? 'bg-blue-500/10 text-blue-400' : ''}
                        ${vehicle.status === 'maintenance' ? 'bg-amber-500/10 text-amber-500' : ''}
                        ${vehicle.status === 'reserved' ? 'bg-indigo-500/10 text-indigo-400' : ''}
                        ${vehicle.status === 'decommissioned' ? 'bg-red-500/10 text-red-500' : ''}
                      `}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-100 truncate group-hover:text-blue-400 transition-colors">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                      <span>{vehicle.year}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span>{vehicle.fuel_type === "diesel" ? "Diesel" : vehicle.fuel_type === "gasoline" ? "Essence" : vehicle.fuel_type}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span>{vehicle.transmission === "manual" ? "Manuelle" : "Auto"}</span>
                    </p>
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className="text-2xl font-black text-slate-100">
                        {formatMAD(vehicle.daily_rate_mad).replace('MAD', '').trim()}
                      </span>
                      <span className="text-xs text-slate-500 ml-1 font-medium">MAD / j</span>
                    </div>
                  </div>

                  {/* Document Status */}
                  <div className="space-y-2 mt-auto">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Assurance</span>
                      <Badge variant="outline" className={`h-4 text-[10px] px-1.5 ${getDocBadgeStyle(vehicle.insurance_expiry)}`}>
                        {isExpired(vehicle.insurance_expiry) ? 'Expirée' : isExpiringSoon(vehicle.insurance_expiry) ? 'Bientôt' : 'À jour'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Visite technique</span>
                      <Badge variant="outline" className={`h-4 text-[10px] px-1.5 ${getDocBadgeStyle(vehicle.technical_visit_expiry)}`}>
                        {isExpired(vehicle.technical_visit_expiry) ? 'Expirée' : isExpiringSoon(vehicle.technical_visit_expiry) ? 'Bientôt' : 'À jour'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Vignette</span>
                      <Badge variant="outline" className={`h-4 text-[10px] px-1.5 ${getDocBadgeStyle(vehicle.vignette_expiry)}`}>
                        {isExpired(vehicle.vignette_expiry) ? 'Expirée' : isExpiringSoon(vehicle.vignette_expiry) ? 'Bientôt' : 'À jour'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-3 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CarFront className="w-3.5 h-3.5" />
                    {vehicle.mileage_km.toLocaleString("fr-MA")} km
                  </div>
                  {vehicle.gps_device_imei && (
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      GPS
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
