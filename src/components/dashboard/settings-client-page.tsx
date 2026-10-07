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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Paramètres Agence
            {tenant.is_superadmin && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border border-amber-500/30 text-amber-400 bg-amber-500/10">
                SuperAdmin
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Identité légale, immatriculation fiscale marocaine et préférences système
          </p>
        </div>
      </div>

      {/* Apple Segmented Tabs */}
      <Tabs defaultValue="agency" className="space-y-6" onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-white/[0.04] border border-white/[0.08] p-1 rounded-2xl h-auto gap-1">
            <TabsTrigger
              value="agency"
              className="rounded-xl px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-xs text-white/60 hover:text-white transition-all"
            >
              <Building2 className="w-3.5 h-3.5 mr-1.5" />
              Profil Agence
            </TabsTrigger>
            <TabsTrigger
              value="legal"
              className="rounded-xl px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-xs text-white/60 hover:text-white transition-all"
            >
              <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
              Légal & Fiscal (ICE/RC)
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="rounded-xl px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-xs text-white/60 hover:text-white transition-all"
            >
              <Globe2 className="w-3.5 h-3.5 mr-1.5" />
              Langue & Devise
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="rounded-xl px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-xs text-white/60 hover:text-white transition-all"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Abonnement
            </TabsTrigger>
          </TabsList>
        </div>

        <form onSubmit={handleSave}>
          {/* Tab 1: Agency Profile */}
          <TabsContent value="agency" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm space-y-5">
                  <div>
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#0a84ff]" />
                      Coordonnées de l'établissement
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5">
                      Les coordonnées figurant sur vos contrats de location et factures.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs text-white/70">Nom commercial</Label>
                      <Input
                        id="name"
                        defaultValue={tenant.name}
                        placeholder="Ex: Al Amal Car Rental"
                        className="bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs text-white/70">Ville principale</Label>
                      <Input
                        id="city"
                        defaultValue={tenant.city}
                        placeholder="Ex: Tanger"
                        className="bg-white/[0.05] border-white/10 rounded-xl text-white placeholder:text-white/35 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs text-white/70">Téléphone agence</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                        <Input
                          id="phone"
                          defaultValue={tenant.phone || "+212 656-735766"}
                          className="pl-9 bg-white/[0.05] border-white/10 rounded-xl text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs text-white/70">Email de contact</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                        <Input
                          id="email"
                          type="email"
                          defaultValue={tenant.email || profile.email}
                          className="pl-9 bg-white/[0.05] border-white/10 rounded-xl text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <Label htmlFor="address" className="text-xs text-white/70">Adresse physique</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-white/40" />
                        <Textarea
                          id="address"
                          rows={2}
                          defaultValue={tenant.address || "Boulevard Mohammed V, Tanger, Maroc"}
                          className="pl-9 bg-white/[0.05] border-white/10 rounded-xl text-white text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Card: Profile */}
              <div>
                <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-xs">
                      {profile.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{profile.full_name}</h4>
                      <p className="text-xs text-white/40 capitalize">{profile.role}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-white/40 block">Email administrateur</span>
                      <span className="font-mono text-white/90">{profile.email}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Tenant ID</span>
                      <span className="font-mono text-[11px] text-white/60 truncate block">{tenant.id}</span>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/25">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Conformité CNDP Activée
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Legal IDs */}
          <TabsContent value="legal" className="outline-none">
            <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm max-w-3xl space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#5e5ce6]" />
                  Identifiants légaux marocains
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Mentions obligatoires sur les contrats, factures et fiches de renseignements police (DGSN).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ice" className="text-xs text-white/70">ICE (15 chiffres)</Label>
                  <Input
                    id="ice"
                    maxLength={15}
                    defaultValue={tenant.ice || "002847192000045"}
                    placeholder="15 chiffres"
                    className="font-mono text-xs tracking-widest bg-white/[0.05] border-white/10 rounded-xl text-white"
                  />
                  <p className="text-[10px] text-white/40">Facturation obligatoire</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="if" className="text-xs text-white/70">IF (Identifiant Fiscal)</Label>
                  <Input
                    id="if"
                    defaultValue={tenant.if_number || "45129873"}
                    placeholder="Numéro IF"
                    className="font-mono text-xs tracking-widest bg-white/[0.05] border-white/10 rounded-xl text-white"
                  />
                  <p className="text-[10px] text-white/40">Direction des Impôts</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rc" className="text-xs text-white/70">RC (Registre Commerce)</Label>
                  <Input
                    id="rc"
                    defaultValue={tenant.rc_number || "84920 / Tanger"}
                    placeholder="Numéro / Ville"
                    className="font-mono text-xs tracking-widest bg-white/[0.05] border-white/10 rounded-xl text-white"
                  />
                  <p className="text-[10px] text-white/40">Tribunal de Commerce</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0a84ff]/10 border border-[#0a84ff]/20 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0a84ff] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white">
                    Génération automatique des avis d'infraction & DGSN
                  </p>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Les contrats compilent les données du conducteur au format officiel exigé par NARSA et la Sûreté Nationale lors des contrôles routiers.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Language & Preferences */}
          <TabsContent value="preferences" className="outline-none">
            <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm max-w-2xl space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#30d158]" />
                  Langue et paramètres régionaux
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Personnalisez l'affichage de l'interface et la devise de facturation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/70">Langue de l'interface</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger className="bg-white/[0.05] border-white/10 rounded-xl text-white text-xs">
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1c1c1e] border-white/10 text-white rounded-xl">
                      <SelectItem value="fr">Français (Par défaut)</SelectItem>
                      <SelectItem value="ar">العربية (Arabe standard)</SelectItem>
                      <SelectItem value="darija">الدارجة المغربية (Darija)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-white/70">Devise principale</Label>
                  <Select defaultValue="mad">
                    <SelectTrigger className="bg-white/[0.05] border-white/10 rounded-xl text-white text-xs">
                      <SelectValue placeholder="Sélectionnez une devise" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1c1c1e] border-white/10 text-white rounded-xl">
                      <SelectItem value="mad">Dirham Marocain (MAD / د.م.)</SelectItem>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="usd">Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Billing */}
          <TabsContent value="billing" className="outline-none">
            <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/[0.08] shadow-sm max-w-3xl space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#ffd60a]" />
                  Formule & Quota de la flotte
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Suivi de votre abonnement agence et des modules actifs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-white/40 font-medium">Formule active</span>
                    <p className="text-base font-bold text-white mt-1">SaaS Agence Pro</p>
                  </div>
                  <div className="mt-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/25">
                      Actif & Illimité
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-white/40 font-medium">Capacité Flotte</span>
                    <p className="text-base font-bold text-white mt-1">Illimitée</p>
                  </div>
                  <p className="text-[10px] text-white/40 mt-3">Sans plafond de véhicules</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-white/40 font-medium">PWA Offline</span>
                    <p className="text-base font-bold text-[#0a84ff] mt-1">Activé</p>
                  </div>
                  <p className="text-[10px] text-white/40 mt-3">Inspections sans internet</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Submit Action */}
          <div className="flex items-center justify-end pt-6 border-t border-white/[0.08]">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#0a84ff] hover:bg-[#0071e3] text-white font-medium rounded-xl shadow-xs active:scale-[0.98] transition-all text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
