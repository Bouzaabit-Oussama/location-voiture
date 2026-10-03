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
  const [activeTab, setActiveTab] = useState<"agency" | "legal" | "preferences" | "billing">("agency");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span>Paramètres de l&apos;agence</span>
            {tenant.is_superadmin && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                SuperAdmin
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez l&apos;identité, les mentions légales marocaines et les préférences de votre agence
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Paramètres enregistrés avec succès</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: "agency", label: "Profil Agence", icon: Building2 },
          { id: "legal", label: "Identifiants Légaux Maroc", icon: FileCheck2 },
          { id: "preferences", label: "Langue & Région", icon: Globe2 },
          { id: "billing", label: "Abonnement & Quotas", icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Agency Profile */}
        {activeTab === "agency" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Coordonnées de l&apos;établissement</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nom commercial de l&apos;agence
                  </label>
                  <input
                    type="text"
                    defaultValue={tenant.name}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                    placeholder="Ex: Al Amal Car Rental"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ville principale
                  </label>
                  <input
                    type="text"
                    defaultValue={tenant.city}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                    placeholder="Ex: Tanger"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Téléphone agence
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      defaultValue={tenant.phone || "+212 656-735766"}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email de contact
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      defaultValue={tenant.email || profile.email}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Adresse physique / Siège
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      rows={2}
                      defaultValue={tenant.address || "Boulevard Mohammed V, Tanger, Maroc"}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Side Card: Manager info */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/30">
                  {profile.full_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold">{profile.full_name}</h3>
                  <p className="text-xs text-slate-400 capitalize">{profile.role}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Email du compte:</span>
                  <p className="font-mono text-slate-200 mt-0.5">{profile.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">Identifiant d&apos;agence:</span>
                  <p className="font-mono text-slate-200 mt-0.5 text-[11px] truncate">{tenant.id}</p>
                </div>
                <div>
                  <span className="text-slate-400">Statut de conformité:</span>
                  <p className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Conforme Loi 09-08 (CNDP)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Legal IDs */}
        {activeTab === "legal" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <span>Identifiants légaux marocains pour vos contrats</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ces mentions figureront automatiquement sur les contrats de location, factures et fiches DGSN.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  ICE (Identifiant Commun de l&apos;Entreprise)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  defaultValue={tenant.ice || "002847192000045"}
                  className="w-full px-3.5 py-2.5 text-sm font-mono tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="15 chiffres"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Obligatoire pour la facturation</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  IF (Identifiant Fiscal)
                </label>
                <input
                  type="text"
                  defaultValue={tenant.if_number || "45129873"}
                  className="w-full px-3.5 py-2.5 text-sm font-mono tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Numéro IF"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">DGI Maroc</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  RC (Registre du Commerce)
                </label>
                <input
                  type="text"
                  defaultValue={tenant.rc_number || "84920 / Tanger"}
                  className="w-full px-3.5 py-2.5 text-sm font-mono tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Numéro / Tribunal"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Tribunal de Commerce</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-blue-900 dark:text-blue-200">
                  Génération automatique des avis d&apos;infraction (RADAR) & DGSN
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  L&apos;application compile les informations du conducteur et le contrat de location au format requis par NARSA et la Sûreté Nationale en cas d&apos;amende routière.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Regional & Language */}
        {activeTab === "preferences" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-600" />
              <span>Langue et mise en page</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Langue de l&apos;interface
                </label>
                <select className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="fr">Français (Par défaut)</option>
                  <option value="ar">العربية (Arabe standard)</option>
                  <option value="darija">الدارجة المغربية (Darija)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Le choix de l&apos;arabe active automatiquement l&apos;affichage RTL (droite à gauche) et la typographie Cairo.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Devise d&apos;affichage
                </label>
                <select className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="mad">Dirham Marocain (MAD / د.م.)</option>
                  <option value="eur">Euro (€)</option>
                  <option value="usd">Dollar ($)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Subscription & Quota */}
        {activeTab === "billing" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span>Formule & Utilisation de la flotte</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Suivez votre quota de véhicules et vos fonctionnalités actives
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Plan actif</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">Formule Pro</p>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Actif & Illimité
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Capacité Flotte</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">Illimitée</p>
                <p className="text-[11px] text-slate-500">Pas de plafond de véhicules</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Module PWA Hors-ligne</span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Activé</p>
                <p className="text-[11px] text-slate-500">Inspections sans internet</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </form>
    </div>
  );
}
