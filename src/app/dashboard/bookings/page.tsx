import { getBookings } from "@/app/actions/bookings";
import { formatMAD, formatDateMA } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  quote: { label: "Devis", color: "#a1a1aa" },
  pending: { label: "En attente", color: "#f59e0b" },
  confirmed: { label: "Confirmée", color: "#3b82f6" },
  active: { label: "En cours", color: "#22c55e" },
  completed: { label: "Terminée", color: "#71717a" },
  cancelled: { label: "Annulée", color: "#ef4444" },
};

export default async function BookingsPage() {
  const { bookings } = await getBookings();

  return (
    <div className="space-y-6 sm:space-y-8 lx-animate-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#fafafa]">
            Réservations
          </h1>
          <p className="text-sm text-[#71717a] mt-1">
            {bookings.length} réservation{bookings.length !== 1 ? "s" : ""} enregistrée{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="#" // Will connect to booking flow
          className={buttonVariants({
            size: "sm",
            className:
              "bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all h-10 px-5",
          })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle réservation
        </Link>
      </div>

      {/* ─── Main Content ─── */}
      {bookings.length === 0 ? (
        <div className="rounded-3xl bg-[#131316] border border-white/[0.08] border-dashed p-12 text-center">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#71717a]">
            <CalendarDays className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-[#fafafa] mb-1">Aucune réservation en cours</h3>
          <p className="text-xs text-[#a1a1aa] max-w-md mx-auto mb-6 leading-relaxed">
            Créez votre première réservation. Le moteur anti-doublon protège
            contre les conflits de planning en temps réel.
          </p>
          <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-sm h-10 px-6 active:scale-[0.98] shadow-xs">
            Créer la première réservation
          </Button>
        </div>
      ) : (
        <div 
          className="rounded-2xl bg-[#131316] border border-white/[0.08] overflow-hidden"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
          }}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11">Réf.</TableHead>
                  <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11">Client</TableHead>
                  <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11 hidden md:table-cell">Véhicule</TableHead>
                  <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11">Période</TableHead>
                  <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11">Montant</TableHead>
                  <TableHead className="text-[#71717a] text-[11px] uppercase tracking-wider font-semibold h-11 text-right">Statut</TableHead>
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
                      className="border-white/[0.04] hover:bg-white/[0.02] transition-colors group/row cursor-pointer"
                    >
                      <TableCell className="align-middle py-4">
                        <span className="font-mono text-xs font-semibold text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-1 rounded-md border border-[#3b82f6]/20">
                          {booking.booking_ref as string}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <p className="font-medium text-sm text-[#fafafa]">
                          {client?.full_name || "—"}
                        </p>
                        <p className="text-[11px] font-mono text-[#71717a] mt-0.5">
                          {client?.phone || ""}
                        </p>
                      </TableCell>
                      <TableCell className="align-middle py-4 hidden md:table-cell">
                        <p className="text-sm font-medium text-[#fafafa] group-hover/row:text-[#3b82f6] transition-colors">
                          {vehicle ? `${vehicle.brand} ${vehicle.model}` : "—"}
                        </p>
                        <p className="text-[11px] font-mono text-[#71717a] mt-0.5">
                          {vehicle?.plate_number || ""}
                        </p>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-xs text-[#a1a1aa]">
                          <span className="font-medium">{formatDateMA(booking.pickup_datetime as string)}</span>
                          <ArrowRight className="hidden sm:block w-3.5 h-3.5 text-[#4e4e56]" />
                          <span className="font-medium">{formatDateMA(booking.dropoff_datetime as string)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-[#fafafa]">
                            {formatMAD(booking.total_amount_mad as number)}
                          </span>
                          {(booking.season_multiplier as number) > 1 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/25 font-bold shadow-sm">
                              ×{booking.season_multiplier as number}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right align-middle py-4">
                        <span 
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{
                            background: `${statusInfo.color}12`,
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.color}25`,
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusInfo.color }} />
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
