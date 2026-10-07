import { getClients } from "@/app/actions/bookings";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Users, Phone, Mail, MapPin, ShieldAlert, CreditCard, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const { clients } = await getClients();

  return (
    <div className="space-y-6 sm:space-y-8 lx-animate-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#fafafa]">
            Clients & Conducteurs
          </h1>
          <p className="text-sm text-[#71717a] mt-1 flex items-center gap-2">
            <span>{clients.length} client{clients.length !== 1 ? "s" : ""} enregistré{clients.length !== 1 ? "s" : ""}</span>
            <span className="w-1 h-1 rounded-full bg-white/[0.12]" />
            <span className="flex items-center gap-1.5 text-[#22c55e]">
              <ShieldAlert className="w-3.5 h-3.5" strokeWidth={1.75} /> 
              CIN haché SHA-256 (Conforme CNDP)
            </span>
          </p>
        </div>
        <Link
          href="#"
          className={buttonVariants({
            size: "sm",
            className:
              "bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all h-10 px-5",
          })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau client
        </Link>
      </div>

      {/* ─── Main Content ─── */}
      {clients.length === 0 ? (
        <div className="rounded-3xl bg-[#131316] border border-white/[0.08] border-dashed p-12 text-center">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#71717a]">
            <Users className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-[#fafafa] mb-1">Aucun client enregistré</h3>
          <p className="text-xs text-[#a1a1aa] max-w-md mx-auto mb-6 leading-relaxed">
            Les numéros CIN sont chiffrés et hachés SHA-256 avant stockage (CNDP).
            Aucune donnée d&apos;identité brute n&apos;est exposée.
          </p>
          <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-sm h-10 px-6 active:scale-[0.98] shadow-xs">
            Ajouter un premier client
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lx-stagger">
          {clients.map((client: { id: string; full_name: string; full_name_ar: string | null; phone: string; email: string | null; city: string | null; cin_hash: string; is_blacklisted: boolean; driving_license_expiry: string | null }) => (
            <div
              key={client.id}
              className="group relative p-5 rounded-2xl bg-[#131316] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col"
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
              }}
            >
              {/* Accent Glow */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-40 transition-opacity duration-300 group-hover:opacity-80"
                style={{
                  background: client.is_blacklisted
                    ? "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)",
                }}
              />

              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-sm font-bold text-[#fafafa]">
                  {client.full_name.charAt(0)}
                </div>
                <div className="flex items-center gap-2">
                  {client.is_blacklisted && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 uppercase tracking-wide">
                      Blacklisté
                    </span>
                  )}
                  <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.06] text-[#71717a] hover:text-[#fafafa] transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Client Info */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#fafafa] tracking-tight mb-0.5 group-hover:text-[#3b82f6] transition-colors">
                  {client.full_name}
                </h3>
                {client.full_name_ar && (
                  <p className="text-[11px] text-[#71717a] font-medium" style={{ direction: "rtl" }}>
                    {client.full_name_ar}
                  </p>
                )}

                <div className="space-y-2 text-xs text-[#a1a1aa] mt-4">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-[#71717a] shrink-0" strokeWidth={1.75} />
                    <span className="font-mono text-[11px]">{client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-[#71717a] shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-[#71717a] shrink-0" strokeWidth={1.75} />
                      <span>{client.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Meta */}
              <div className="mt-5 pt-4 border-t border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#22c55e] shrink-0" strokeWidth={1.75} />
                  <span className="font-mono text-[10px] text-[#71717a] truncate bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.06]">
                    CIN: {client.cin_hash.slice(0, 16)}...
                  </span>
                </div>
                
                {client.driving_license_expiry && (
                  <div className="flex items-center gap-2 text-[11px] text-[#71717a]">
                    <CreditCard className="w-3.5 h-3.5 text-[#71717a] shrink-0" strokeWidth={1.75} />
                    <span>Permis: {new Date(client.driving_license_expiry).toLocaleDateString("fr-MA")}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
