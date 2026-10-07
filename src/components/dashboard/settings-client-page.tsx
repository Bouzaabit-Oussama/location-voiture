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
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            Paramètres de l'agence
            {tenant.is_superadmin && (
              <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10">
                SuperAdmin
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez l'identité, les mentions légales marocaines et vos préférences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="agency" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="agency" className="data-[state=active]:bg-slate-800">
            <Building2 className="w-4 h-4 mr-2" />
            Profil Agence
          </TabsTrigger>
          <TabsTrigger value="legal" className="data-[state=active]:bg-slate-800">
            <FileCheck2 className="w-4 h-4 mr-2" />
            Légal & Fiscal
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-slate-800">
            <Globe2 className="w-4 h-4 mr-2" />
            Langue & Devise
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-slate-800">
            <CreditCard className="w-4 h-4 mr-2" />
            Abonnement
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave}>
          {/* Tab 1: Agency Profile */}
          <TabsContent value="agency" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 border-slate-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-500" />
                      Coordonnées de l'établissement
                    </CardTitle>
                    <CardDescription>
                      Les informations de contact qui apparaîtront sur vos devis et contrats.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom commercial de l'agence</Label>
                        <Input
                          id="name"
                          defaultValue={tenant.name}
                          placeholder="Ex: Al Amal Car Rental"
                          className="bg-slate-950 border-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville principale</Label>
                        <Input
                          id="city"
                          defaultValue={tenant.city}
                          placeholder="Ex: Tanger"
                          className="bg-slate-950 border-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone agence</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            defaultValue={tenant.phone || "+212 656-735766"}
                            className="pl-9 bg-slate-950 border-slate-800"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email de contact</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            defaultValue={tenant.email || profile.email}
                            className="pl-9 bg-slate-950 border-slate-800"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address">Adresse physique / Siège</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Textarea
                            id="address"
                            rows={2}
                            defaultValue={tenant.address || "Boulevard Mohammed V, Tanger, Maroc"}
                            className="pl-9 bg-slate-950 border-slate-800 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Card: Manager info */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border-slate-800/60 backdrop-blur-sm">
                  <CardHeader className="pb-4 border-b border-slate-800/60">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/20">
                        {profile.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-base">{profile.full_name}</CardTitle>
                        <CardDescription className="capitalize">{profile.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Email du compte</Label>
                      <p className="font-mono text-sm">{profile.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Identifiant d'agence</Label>
                      <p className="font-mono text-[11px] truncate">{tenant.id}</p>
                    </div>
                    <div className="pt-2">
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 gap-1.5 py-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Conforme CNDP
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Legal IDs */}
          <TabsContent value="legal" className="outline-none">
            <Card className="bg-slate-900/50 border-slate-800/60 backdrop-blur-sm max-w-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-indigo-500" />
                  Identifiants légaux marocains
                </CardTitle>
                <CardDescription>
                  Ces mentions figureront automatiquement sur vos contrats de location, factures et fiches de police (DGSN).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ice">ICE (Identifiant Commun)</Label>
                    <Input
                      id="ice"
                      maxLength={15}
                      defaultValue={tenant.ice || "002847192000045"}
                      placeholder="15 chiffres"
                      className="font-mono text-sm tracking-widest bg-slate-950 border-slate-800"
                    />
                    <p className="text-[10px] text-muted-foreground">Obligatoire pour la facturation</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="if">IF (Identifiant Fiscal)</Label>
                    <Input
                      id="if"
                      defaultValue={tenant.if_number || "45129873"}
                      placeholder="Numéro IF"
                      className="font-mono text-sm tracking-widest bg-slate-950 border-slate-800"
                    />
                    <p className="text-[10px] text-muted-foreground">Direction Générale des Impôts</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rc">RC (Registre du Commerce)</Label>
                    <Input
                      id="rc"
                      defaultValue={tenant.rc_number || "84920 / Tanger"}
                      placeholder="Numéro / Ville"
                      className="font-mono text-sm tracking-widest bg-slate-950 border-slate-800"
                    />
                    <p className="text-[10px] text-muted-foreground">Tribunal de Commerce</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3 mt-6">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-blue-300">
                      Génération automatique des avis d'infraction & DGSN
                    </p>
                    <p className="text-xs text-blue-400/80">
                      L'application compile les informations du conducteur et le contrat de location au format requis par NARSA et la Sûreté Nationale en cas d'amende routière.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Regional & Language */}
          <TabsContent value="preferences" className="outline-none">
            <Card className="bg-slate-900/50 border-slate-800/60 backdrop-blur-sm max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-emerald-500" />
                  Langue et paramètres régionaux
                </CardTitle>
                <CardDescription>
                  Personnalisez l'affichage pour votre équipe et vos clients.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Langue de l'interface</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger className="bg-slate-950 border-slate-800">
                        <SelectValue placeholder="Sélectionnez une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français (Par défaut)</SelectItem>
                        <SelectItem value="ar">العربية (Arabe standard)</SelectItem>
                        <SelectItem value="darija">الدارجة المغربية (Darija)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground">
                      L'arabe active l'affichage de droite à gauche (RTL).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Devise d'affichage</Label>
                    <Select defaultValue="mad">
                      <SelectTrigger className="bg-slate-950 border-slate-800">
                        <SelectValue placeholder="Sélectionnez une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mad">Dirham Marocain (MAD / د.م.)</SelectItem>
                        <SelectItem value="eur">Euro (€)</SelectItem>
                        <SelectItem value="usd">Dollar ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Subscription & Quota */}
          <TabsContent value="billing" className="outline-none">
            <Card className="bg-slate-900/50 border-slate-800/60 backdrop-blur-sm max-w-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-500" />
                  Formule & Utilisation de la flotte
                </CardTitle>
                <CardDescription>
                  Suivez votre quota de véhicules et vos fonctionnalités actives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground font-medium">Plan actif</span>
                      <p className="text-lg font-bold text-white mt-1">Formule Pro</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        Actif & Illimité
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground font-medium">Capacité Flotte</span>
                      <p className="text-lg font-bold text-white mt-1">Illimitée</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Pas de plafond de véhicules</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground font-medium">PWA Hors-ligne</span>
                      <p className="text-lg font-bold text-blue-400 mt-1">Activé</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Inspections sans internet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Action */}
          <div className="flex items-center justify-end pt-6 mt-6 border-t border-slate-800/60">
            <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
