"use client";

import { useState } from "react";
import {
  Building2,
  FileCheck2,
  Globe2,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Car
} from "lucide-react";
import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SettingsClientPageProps {
  tenant: {
    id: string;
    name: string;
    city: string;
    address?: string;
    phone?: string;
    email?: string;
    ice?: string;
    if_number?: string;
    rc_number?: string;
    is_superadmin?: boolean;
    subscription_status?: string;
  };
  profile: {
    full_name: string;
    email: string;
    role: string;
  };
}

export function SettingsClientPage({ tenant, profile }: SettingsClientPageProps) {
  const [activeTab, setActiveTab] = useState("agency");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Paramètres enregistrés", {
        description: "Vos modifications ont été sauvegardées avec succès.",
      });
    }, 600);
  };

  return (
    <div className="space-y-6 sm:space-y-8 lx-animate-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#fafafa] flex items-center gap-3">
            Paramètres Agence
            {tenant.is_superadmin && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#f59e0b]/30 text-[#f59e0b] bg-[#f59e0b]/10 shadow-sm">
                SuperAdmin
              </span>
            )}
          </h1>
          <p className="text-sm text-[#71717a] mt-1">
            Identité légale, immatriculation fiscale marocaine et préférences système
          </p>
        </div>
      </div>

      {/* ─── Segmented Tabs ─── */}
      <Tabs defaultValue="agency" className="space-y-8" onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-[#131316] border border-white/[0.08] p-1.5 rounded-2xl h-auto gap-1 shadow-sm">
            <TabsTrigger
              value="agency"
              className="rounded-xl px-4 py-2 text-[13px] font-medium data-[state=active]:bg-white/[0.06] data-[state=active]:text-[#fafafa] data-[state=active]:shadow-sm text-[#71717a] hover:text-[#fafafa] transition-all"
            >
              <Building2 className="w-4 h-4 mr-2" strokeWidth={2} />
              Profil Agence
            </TabsTrigger>
            <TabsTrigger
              value="legal"
              className="rounded-xl px-4 py-2 text-[13px] font-medium data-[state=active]:bg-white/[0.06] data-[state=active]:text-[#fafafa] data-[state=active]:shadow-sm text-[#71717a] hover:text-[#fafafa] transition-all"
            >
              <FileCheck2 className="w-4 h-4 mr-2" strokeWidth={2} />
              Légal & Fiscal
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="rounded-xl px-4 py-2 text-[13px] font-medium data-[state=active]:bg-white/[0.06] data-[state=active]:text-[#fafafa] data-[state=active]:shadow-sm text-[#71717a] hover:text-[#fafafa] transition-all"
            >
              <Globe2 className="w-4 h-4 mr-2" strokeWidth={2} />
              Région
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="rounded-xl px-4 py-2 text-[13px] font-medium data-[state=active]:bg-white/[0.06] data-[state=active]:text-[#fafafa] data-[state=active]:shadow-sm text-[#71717a] hover:text-[#fafafa] transition-all"
            >
              <CreditCard className="w-4 h-4 mr-2" strokeWidth={2} />
              Abonnement
            </TabsTrigger>
          </TabsList>
        </div>

        <form onSubmit={handleSave}>
          {/* ─── Tab 1: Agency Profile ─── */}
          <TabsContent value="agency" className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div 
                  className="p-6 sm:p-8 rounded-3xl bg-[#131316] border border-white/[0.08] space-y-6"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)" }}
                >
                  <div>
                    <h3 className="text-base font-semibold text-[#fafafa] flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#3b82f6]" strokeWidth={2} />
                      Coordonnées de l'établissement
                    </h3>
                    <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                      Les coordonnées figurant sur vos contrats de location et factures.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-semibold text-[#a1a1aa]">Nom commercial</Label>
                      <Input
                        id="name"
                        defaultValue={tenant.name}
                        placeholder="Ex: Al Amal Car Rental"
                        className="bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] placeholder:text-[#4e4e56] text-sm h-11 focus-visible:ring-1 focus-visible:ring-[#3b82f6]/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-xs font-semibold text-[#a1a1aa]">Ville principale</Label>
                      <Input
                        id="city"
                        defaultValue={tenant.city}
                        placeholder="Ex: Tanger"
                        className="bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] placeholder:text-[#4e4e56] text-sm h-11 focus-visible:ring-1 focus-visible:ring-[#3b82f6]/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-semibold text-[#a1a1aa]">Téléphone agence</Label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" strokeWidth={1.75} />
                        <Input
                          id="phone"
                          defaultValue={tenant.phone || "+212 656-735766"}
                          className="pl-10 bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] text-sm h-11 focus-visible:ring-1 focus-visible:ring-[#3b82f6]/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold text-[#a1a1aa]">Email de contact</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" strokeWidth={1.75} />
                        <Input
                          id="email"
                          type="email"
                          defaultValue={tenant.email || profile.email}
                          className="pl-10 bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] text-sm h-11 focus-visible:ring-1 focus-visible:ring-[#3b82f6]/50"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address" className="text-xs font-semibold text-[#a1a1aa]">Adresse physique</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#71717a]" strokeWidth={1.75} />
                        <Textarea
                          id="address"
                          rows={2}
                          defaultValue={tenant.address || "Boulevard Mohammed V, Tanger, Maroc"}
                          className="pl-10 bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] text-sm focus-visible:ring-1 focus-visible:ring-[#3b82f6]/50 resize-none py-3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Card: Profile */}
              <div>
                <div 
                  className="p-6 rounded-3xl bg-[#131316] border border-white/[0.08] space-y-5"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)" }}
                >
                  <div className="flex items-center gap-4 pb-5 border-b border-white/[0.08]">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] flex items-center justify-center font-bold text-lg text-white shadow-sm">
                      {profile.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#fafafa] tracking-tight">{profile.full_name}</h4>
                      <p className="text-xs text-[#a1a1aa] capitalize mt-0.5">{profile.role}</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-[13px]">
                    <div>
                      <span className="text-[#71717a] block text-[11px] uppercase tracking-wider font-medium mb-1">Email administrateur</span>
                      <span className="font-mono text-[#fafafa]">{profile.email}</span>
                    </div>
                    <div>
                      <span className="text-[#71717a] block text-[11px] uppercase tracking-wider font-medium mb-1">Tenant ID</span>
                      <span className="font-mono text-[#a1a1aa] truncate block bg-white/[0.04] p-2 rounded-xl border border-white/[0.08]">{tenant.id}</span>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 w-full shadow-sm">
                        <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                        Conformité CNDP Activée
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ─── Tab 2: Legal IDs ─── */}
          <TabsContent value="legal" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div 
              className="p-6 sm:p-8 rounded-3xl bg-[#131316] border border-white/[0.08] max-w-4xl space-y-8"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)" }}
            >
              <div>
                <h3 className="text-base font-semibold text-[#fafafa] flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#8b5cf6]" strokeWidth={2} />
                  Identifiants légaux marocains
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                  Mentions obligatoires sur les contrats, factures et fiches de renseignements police (DGSN).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ice" className="text-xs font-semibold text-[#a1a1aa]">ICE (15 chiffres)</Label>
                  <Input
                    id="ice"
                    maxLength={15}
                    defaultValue={tenant.ice || "002847192000045"}
                    placeholder="15 chiffres"
                    className="font-mono text-sm tracking-widest bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] h-11 focus-visible:ring-1 focus-visible:ring-[#8b5cf6]/50"
                  />
                  <p className="text-[11px] text-[#71717a]">Facturation obligatoire</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="if" className="text-xs font-semibold text-[#a1a1aa]">IF (Identifiant Fiscal)</Label>
                  <Input
                    id="if"
                    defaultValue={tenant.if_number || "45129873"}
                    placeholder="Numéro IF"
                    className="font-mono text-sm tracking-widest bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] h-11 focus-visible:ring-1 focus-visible:ring-[#8b5cf6]/50"
                  />
                  <p className="text-[11px] text-[#71717a]">Direction des Impôts</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rc" className="text-xs font-semibold text-[#a1a1aa]">RC (Registre Commerce)</Label>
                  <Input
                    id="rc"
                    defaultValue={tenant.rc_number || "84920 / Tanger"}
                    placeholder="Numéro / Ville"
                    className="font-mono text-sm tracking-widest bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] h-11 focus-visible:ring-1 focus-visible:ring-[#8b5cf6]/50"
                  />
                  <p className="text-[11px] text-[#71717a]">Tribunal de Commerce</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex gap-4 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-[#3b82f6] shrink-0 mt-0.5" strokeWidth={1.75} />
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-[#fafafa]">
                    Génération automatique des avis d'infraction & DGSN
                  </p>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-2xl">
                    Les contrats compilent les données du conducteur au format officiel exigé par NARSA et la Sûreté Nationale lors des contrôles routiers.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ─── Tab 3: Language & Preferences ─── */}
          <TabsContent value="preferences" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div 
              className="p-6 sm:p-8 rounded-3xl bg-[#131316] border border-white/[0.08] max-w-2xl space-y-6"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)" }}
            >
              <div>
                <h3 className="text-base font-semibold text-[#fafafa] flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#22c55e]" strokeWidth={2} />
                  Langue et paramètres régionaux
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                  Personnalisez l'affichage de l'interface et la devise de facturation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-[#a1a1aa]">Langue de l'interface</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] text-sm h-11 focus:ring-1 focus:ring-[#22c55e]/50">
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131316] border-white/[0.08] text-[#fafafa] rounded-xl shadow-lg">
                      <SelectItem value="fr" className="focus:bg-white/[0.06] focus:text-[#fafafa]">Français (Par défaut)</SelectItem>
                      <SelectItem value="ar" className="focus:bg-white/[0.06] focus:text-[#fafafa]">العربية (Arabe standard)</SelectItem>
                      <SelectItem value="darija" className="focus:bg-white/[0.06] focus:text-[#fafafa]">الدارجة المغربية (Darija)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-[#a1a1aa]">Devise principale</Label>
                  <Select defaultValue="mad">
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.08] rounded-xl text-[#fafafa] text-sm h-11 focus:ring-1 focus:ring-[#22c55e]/50">
                      <SelectValue placeholder="Sélectionnez une devise" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131316] border-white/[0.08] text-[#fafafa] rounded-xl shadow-lg">
                      <SelectItem value="mad" className="focus:bg-white/[0.06] focus:text-[#fafafa]">Dirham Marocain (MAD / د.م.)</SelectItem>
                      <SelectItem value="eur" className="focus:bg-white/[0.06] focus:text-[#fafafa]">Euro (€)</SelectItem>
                      <SelectItem value="usd" className="focus:bg-white/[0.06] focus:text-[#fafafa]">Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ─── Tab 4: Billing ─── */}
          <TabsContent value="billing" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div 
              className="p-6 sm:p-8 rounded-3xl bg-[#131316] border border-white/[0.08] max-w-4xl space-y-6"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)" }}
            >
              <div>
                <h3 className="text-base font-semibold text-[#fafafa] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#f59e0b]" strokeWidth={2} />
                  Formule & Quota de la flotte
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                  Suivi de votre abonnement agence et des modules actifs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between hover:bg-white/[0.03] transition-colors">
                  <div>
                    <span className="text-[11px] text-[#71717a] font-medium uppercase tracking-wider">Formule active</span>
                    <p className="text-lg font-bold text-[#fafafa] mt-1.5">SaaS Agence Pro</p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
                      Actif & Illimité
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between hover:bg-white/[0.03] transition-colors">
                  <div>
                    <span className="text-[11px] text-[#71717a] font-medium uppercase tracking-wider">Capacité Flotte</span>
                    <p className="text-lg font-bold text-[#fafafa] mt-1.5">Illimitée</p>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] mt-4 font-medium">Sans plafond de véhicules</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between hover:bg-white/[0.03] transition-colors">
                  <div>
                    <span className="text-[11px] text-[#71717a] font-medium uppercase tracking-wider">PWA Offline</span>
                    <p className="text-lg font-bold text-[#3b82f6] mt-1.5">Activé</p>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] mt-4 font-medium">Inspections sans internet</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ─── Submit Action ─── */}
          <div className="flex items-center justify-end mt-8 pt-6 border-t border-white/[0.08]">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#fafafa] hover:bg-white text-black font-semibold rounded-xl shadow-xs active:scale-[0.98] transition-all text-sm h-11 px-6"
            >
              <Save className="w-4 h-4 mr-2" strokeWidth={2} />
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
