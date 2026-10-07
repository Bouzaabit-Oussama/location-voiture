import { getClients } from "@/app/actions/bookings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Phone, Mail, MapPin, ShieldAlert, CreditCard } from "lucide-react";

export default async function ClientsPage() {
  const { clients } = await getClients();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Clients & Conducteurs
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 flex items-center gap-2">
            <span>{clients.length} client{clients.length !== 1 ? "s" : ""} enregistré{clients.length !== 1 ? "s" : ""}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1 text-[#ffd60a]"><ShieldAlert className="w-3.5 h-3.5" /> CIN haché SHA-256 (CNDP Loi 09-08)</span>
          </p>
        </div>
        <Button className="bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl shadow-xs active:scale-[0.98] transition-all">
          <Plus className="w-4 h-4 mr-1.5" />
          Nouveau client
        </Button>
      </div>

      {/* Empty State or Clients Grid */}
      {clients.length === 0 ? (
        <div className="rounded-3xl bg-[#1c1c1e] border border-white/[0.08] border-dashed p-12 text-center">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white/40">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Aucun client enregistré</h3>
          <p className="text-xs text-white/40 max-w-md mx-auto mb-5">
            Les numéros CIN sont chiffrés et hachés SHA-256 avant stockage (CNDP).
            Aucune donnée d&apos;identité brute n&apos;est exposée.
          </p>
          <Button className="bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl text-xs active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-1.5" /> Nouveau client
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {clients.map((client: { id: string; full_name: string; full_name_ar: string | null; phone: string; email: string | null; city: string | null; cin_hash: string; is_blacklisted: boolean; driving_license_expiry: string | null }) => (
            <div
              key={client.id}
              className="rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm hover:border-white/20 transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-base tracking-tight">
                      {client.full_name}
                    </h3>
                    {client.full_name_ar && (
                      <p className="text-xs text-white/40 mt-0.5 font-medium" style={{ direction: "rtl" }}>
                        {client.full_name_ar}
                      </p>
                    )}
                  </div>
                  {client.is_blacklisted && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/25">
                      Blacklisté
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-white/60 mt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      <span>{client.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                    <ShieldAlert className="w-3.5 h-3.5 text-white/30 shrink-0" />
                    <span className="font-mono text-[10px] text-white/40 truncate">
                      CIN Hash: {client.cin_hash.slice(0, 16)}...
                    </span>
                  </div>
                </div>
              </div>

              {client.driving_license_expiry && (
                <div className="px-5 py-3 bg-black/30 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-white/50" />
                    <span>Permis valide jusqu&apos;au: {new Date(client.driving_license_expiry).toLocaleDateString("fr-MA")}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
