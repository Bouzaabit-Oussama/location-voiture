import { getClients } from "@/app/actions/bookings";

export default async function ClientsPage() {
  const { clients } = await getClients();

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Clients
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {clients.length} client{clients.length !== 1 ? "s" : ""} • CIN haché SHA-256 (CNDP)
          </p>
        </div>
        <button className="btn btn-primary">+ Nouveau client</button>
      </div>

      {clients.length === 0 ? (
        <div className="card">
          <div className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
            <p className="text-5xl mb-4">👥</p>
            <p className="text-lg font-medium mb-2">Aucun client enregistré</p>
            <p className="text-sm max-w-md mx-auto">
              Les numéros CIN sont hachés SHA-256 avant stockage, conformément à la Loi 09-08 (CNDP).
              Aucune donnée CIN brute n&apos;est jamais conservée.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client: { id: string; full_name: string; full_name_ar: string | null; phone: string; email: string | null; city: string | null; cin_hash: string; is_blacklisted: boolean; driving_license_expiry: string | null }) => (
            <div key={client.id} className="card animate-fade-in" style={{ padding: "1.25rem" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold" style={{ color: "var(--color-text)" }}>
                    {client.full_name}
                  </h3>
                  {client.full_name_ar && (
                    <p className="text-sm" style={{ color: "var(--color-text-muted)", direction: "rtl" }}>
                      {client.full_name_ar}
                    </p>
                  )}
                </div>
                {client.is_blacklisted && (
                  <span className="badge badge-danger">Blacklisté</span>
                )}
              </div>

              <div className="space-y-1.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
                <p>📱 {client.phone}</p>
                {client.email && <p>📧 {client.email}</p>}
                {client.city && <p>📍 {client.city}</p>}
                <p className="font-mono text-xs" style={{ color: "var(--color-text-muted)", opacity: 0.6 }}>
                  🔒 CIN: {client.cin_hash.slice(0, 12)}...
                </p>
              </div>

              {client.driving_license_expiry && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Permis expire: {new Date(client.driving_license_expiry).toLocaleDateString("fr-MA")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
