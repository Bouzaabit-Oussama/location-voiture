import { getBookings } from "@/app/actions/bookings";
import { formatMAD, formatDateMA } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  quote: { label: "Devis", class: "badge-neutral" },
  pending: { label: "En attente", class: "badge-warning" },
  confirmed: { label: "Confirmée", class: "badge-info" },
  active: { label: "En cours", class: "badge-success" },
  completed: { label: "Terminée", class: "badge-neutral" },
  cancelled: { label: "Annulée", class: "badge-danger" },
};

export default async function BookingsPage() {
  const { bookings } = await getBookings();

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Réservations
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {bookings.length} réservation{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn btn-primary">+ Nouvelle réservation</button>
      </div>

      {bookings.length === 0 ? (
        <div className="card">
          <div className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
            <p className="text-5xl mb-4">📅</p>
            <p className="text-lg font-medium mb-2">Aucune réservation</p>
            <p className="text-sm max-w-md mx-auto">
              Créez votre première réservation. Le moteur anti-doublon protège
              contre les réservations conflictuelles automatiquement.
            </p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="text-start px-4 py-3 font-medium" style={{ color: "var(--color-text-muted)" }}>Réf.</th>
                  <th className="text-start px-4 py-3 font-medium" style={{ color: "var(--color-text-muted)" }}>Client</th>
                  <th className="text-start px-4 py-3 font-medium" style={{ color: "var(--color-text-muted)" }}>Véhicule</th>
                  <th className="text-start px-4 py-3 font-medium" style={{ color: "var(--color-text-muted)" }}>Période</th>
                  <th className="text-start px-4 py-3 font-medium" style={{ color: "var(--color-text-muted)" }}>Montant</th>
                  <th className="text-start px-4 py-3 font-medium" style={{ color: "var(--color-text-muted)" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: Record<string, unknown>) => {
                  const vehicle = booking.vehicle as Record<string, string> | null;
                  const client = booking.client as Record<string, string> | null;
                  const statusInfo = STATUS_CONFIG[booking.status as string] || STATUS_CONFIG.pending;

                  return (
                    <tr
                      key={booking.id as string}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      style={{ borderBottom: "1px solid var(--color-border)" }}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                        {booking.booking_ref as string}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: "var(--color-text)" }}>
                          {client?.full_name || "—"}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {client?.phone || ""}
                        </p>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--color-text)" }}>
                        {vehicle ? `${vehicle.brand} ${vehicle.model}` : "—"}
                        <br />
                        <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                          {vehicle?.plate_number || ""}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {formatDateMA(booking.pickup_datetime as string)}
                        <br />
                        → {formatDateMA(booking.dropoff_datetime as string)}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-text)" }}>
                        {formatMAD(booking.total_amount_mad as number)}
                        {(booking.season_multiplier as number) > 1 && (
                          <span className="text-xs ms-1" style={{ color: "var(--color-warning)" }}>
                            ×{booking.season_multiplier as number}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
