import { getClients } from "@/app/actions/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Phone, Mail, MapPin, ShieldAlert, CreditCard } from "lucide-react";

export default async function ClientsPage() {
  const { clients } = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Clients
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <span>{clients.length} client{clients.length !== 1 ? "s" : ""}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-amber-500" /> CIN haché SHA-256 (CNDP)</span>
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      {clients.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">Aucun client enregistré</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Les numéros CIN sont hachés SHA-256 avant stockage, conformément à la Loi 09-08 (CNDP).
              Aucune donnée CIN brute n&apos;est jamais conservée.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">
              <Plus className="w-4 h-4 mr-2" /> Nouveau client
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client: { id: string; full_name: string; full_name_ar: string | null; phone: string; email: string | null; city: string | null; cin_hash: string; is_blacklisted: boolean; driving_license_expiry: string | null }) => (
            <Card key={client.id} className="bg-slate-950 border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 transition-all flex flex-col">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-lg">
                      {client.full_name}
                    </h3>
                    {client.full_name_ar && (
                      <p className="text-sm text-slate-400 mt-0.5 font-medium" style={{ direction: "rtl" }}>
                        {client.full_name_ar}
                      </p>
                    )}
                  </div>
                  {client.is_blacklisted && (
                    <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">
                      Blacklisté
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-2 flex-1">
                <div className="space-y-2.5 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>{client.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80">
                    <ShieldAlert className="w-4 h-4 text-slate-500" />
                    <span className="font-mono text-[10px] text-slate-500">
                      CIN: {client.cin_hash.slice(0, 12)}...
                    </span>
                  </div>
                </div>
              </CardContent>

              {client.driving_license_expiry && (
                <CardFooter className="p-3 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    Permis expire: {new Date(client.driving_license_expiry).toLocaleDateString("fr-MA")}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
