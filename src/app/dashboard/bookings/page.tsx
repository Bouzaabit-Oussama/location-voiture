import { getBookings } from "@/app/actions/bookings";
import { formatMAD, formatDateMA } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarDays, ArrowRight } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  quote: { label: "Devis", class: "bg-white/10 text-white/70 border-white/10" },
  pending: { label: "En attente", class: "bg-[#ffd60a]/15 text-[#ffd60a] border-[#ffd60a]/25" },
  confirmed: { label: "Confirmée", class: "bg-[#0a84ff]/15 text-[#0a84ff] border-[#0a84ff]/25" },
  active: { label: "En cours", class: "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/25" },
  completed: { label: "Terminée", class: "bg-white/10 text-white/60 border-white/10" },
  cancelled: { label: "Annulée", class: "bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/25" },
};

export default async function BookingsPage() {
  const { bookings } = await getBookings();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Réservations
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            {bookings.length} réservation{bookings.length !== 1 ? "s" : ""} enregistrée{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button className="bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl shadow-xs active:scale-[0.98] transition-all">
          <Plus className="w-4 h-4 mr-1.5" />
          Nouvelle réservation
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-3xl bg-[#1c1c1e] border border-white/[0.08] border-dashed p-12 text-center">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white/40">
            <CalendarDays className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Aucune réservation en cours</h3>
          <p className="text-xs text-white/40 max-w-md mx-auto mb-5">
            Créez votre première réservation. Le moteur anti-doublon protège
            contre les conflits de planning en temps réel.
          </p>
          <Button className="bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl text-xs active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-1.5" /> Nouvelle réservation
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#1c1c1e] border border-white/[0.08] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-white/45 text-xs font-medium">Réf.</TableHead>
                  <TableHead className="text-white/45 text-xs font-medium">Client</TableHead>
                  <TableHead className="text-white/45 text-xs font-medium">Véhicule</TableHead>
                  <TableHead className="text-white/45 text-xs font-medium">Période</TableHead>
                  <TableHead className="text-white/45 text-xs font-medium">Montant</TableHead>
                  <TableHead className="text-white/45 text-xs font-medium text-right">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking: Record<string, unknown>) => {
                  const vehicle = booking.vehicle as Record<string, string> | null;
                  const client = booking.client as Record<string, string> | null;
                  const statusInfo = STATUS_CONFIG[booking.status as string] || STATUS_CONFIG.pending;

                  return (
                    <TableRow
                      key={booking.id as string}
                      className="border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-[#0a84ff] align-top">
                        {booking.booking_ref as string}
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="font-medium text-sm text-white">
                          {client?.full_name || "—"}
                        </p>
                        <p className="text-xs font-mono text-white/40 mt-0.5">
                          {client?.phone || ""}
                        </p>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="text-sm font-medium text-white">
                          {vehicle ? `${vehicle.brand} ${vehicle.model}` : "—"}
                        </p>
                        <p className="text-xs font-mono text-white/40 mt-0.5">
                          {vehicle?.plate_number || ""}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs text-white/60 align-top">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{formatDateMA(booking.pickup_datetime as string)}</span>
                          <ArrowRight className="w-3 h-3 text-white/30" />
                          <span>{formatDateMA(booking.dropoff_datetime as string)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-white">
                            {formatMAD(booking.total_amount_mad as number)}
                          </span>
                          {(booking.season_multiplier as number) > 1 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#ffd60a]/15 text-[#ffd60a] border border-[#ffd60a]/25 font-bold">
                              ×{booking.season_multiplier as number}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
