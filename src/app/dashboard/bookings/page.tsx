import { getBookings } from "@/app/actions/bookings";
import { formatMAD, formatDateMA } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarDays, ArrowRight } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  quote: { label: "Devis", class: "bg-slate-800 text-slate-300" },
  pending: { label: "En attente", class: "bg-amber-500/10 text-amber-500" },
  confirmed: { label: "Confirmée", class: "bg-blue-500/10 text-blue-400" },
  active: { label: "En cours", class: "bg-emerald-500/10 text-emerald-500" },
  completed: { label: "Terminée", class: "bg-slate-800 text-slate-300" },
  cancelled: { label: "Annulée", class: "bg-red-500/10 text-red-500" },
};

export default async function BookingsPage() {
  const { bookings } = await getBookings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Réservations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {bookings.length} réservation{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle réservation
        </Button>
      </div>

      {bookings.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">Aucune réservation</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Créez votre première réservation. Le moteur anti-doublon protège
              contre les réservations conflictuelles automatiquement.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">
              <Plus className="w-4 h-4 mr-2" /> Nouvelle réservation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-950 border-slate-800">
          <Table>
            <TableHeader className="bg-slate-900/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Réf.</TableHead>
                <TableHead className="text-slate-400 font-medium">Client</TableHead>
                <TableHead className="text-slate-400 font-medium">Véhicule</TableHead>
                <TableHead className="text-slate-400 font-medium">Période</TableHead>
                <TableHead className="text-slate-400 font-medium">Montant</TableHead>
                <TableHead className="text-slate-400 font-medium">Statut</TableHead>
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
                    className="border-slate-800 hover:bg-slate-900/50 transition-colors"
                  >
                    <TableCell className="font-mono text-xs font-semibold text-blue-400">
                      {booking.booking_ref as string}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-200">
                        {client?.full_name || "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {client?.phone || ""}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-slate-200">
                        {vehicle ? `${vehicle.brand} ${vehicle.model}` : "—"}
                      </p>
                      <p className="text-xs font-mono text-slate-500">
                        {vehicle?.plate_number || ""}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span>{formatDateMA(booking.pickup_datetime as string)}</span>
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                        <span>{formatDateMA(booking.dropoff_datetime as string)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-200">
                          {formatMAD(booking.total_amount_mad as number)}
                        </span>
                        {(booking.season_multiplier as number) > 1 && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 bg-amber-500/10 text-amber-500 border-amber-500/20">
                            ×{booking.season_multiplier as number}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-medium border-0 ${statusInfo.class}`}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
