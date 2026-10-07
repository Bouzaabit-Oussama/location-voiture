import Link from "next/link";
import { APP_VERSION } from "@/lib/version";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Car, CalendarCheck2, Smartphone, FileText, ShieldCheck, BarChart3 } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Car,
      title: "Gestion de flotte",
      description: "Suivi en temps réel, visite technique, assurance et vignette. Conformité Ministère du Transport.",
    },
    {
      icon: CalendarCheck2,
      title: "Réservations intelligentes",
      description: "Moteur anti double-réservation. Tarifs saisonniers automatiques pour la période MRE.",
    },
    {
      icon: Smartphone,
      title: "Inspection hors ligne",
      description: "Application PWA fonctionnant sans internet. Synchronisation automatique au retour en ligne.",
    },
    {
      icon: FileText,
      title: "Contrats en arabe",
      description: "Génération PDF bilingue (FR/AR) avec mise en page BiDi conforme DGSN.",
    },
    {
      icon: ShieldCheck,
      title: "Conformité CNDP",
      description: "Protection des données personnelles conforme à la Loi 09-08. Hachage SHA-256 des CIN.",
    },
    {
      icon: BarChart3,
      title: "Tableau de bord SaaS",
      description: "Multi-agence, facturation ICE/IF/RC, réseau de mauvais payeurs décentralisé.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 border border-blue-500/20">
                LV
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight tracking-tight">
                  Location<span className="text-blue-500">Voiture</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider -mt-1 uppercase">v{APP_VERSION}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                  Essai gratuit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 sm:py-32 flex flex-col items-center text-center">
          {/* Background effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 mb-8 py-1.5 px-4 rounded-full gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              🇲🇦 Conçu pour le marché marocain
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto">
              Gérez votre flotte de <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                location de voitures
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl mb-12 text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Réservations, inspections, contrats et conformité CNDP — tout en une seule plateforme.
              Fonctionne hors ligne. Prêt pour la saison MRE.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 group w-full sm:w-auto">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 w-full sm:w-auto">
                  Découvrir les fonctionnalités
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-slate-900/50 border-y border-slate-800 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-100">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-lg text-slate-400">
                Une plateforme complète pour les agences de location au Maroc
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Card key={i} className="bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300 group">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                        <Icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-slate-200">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-2xl shadow-blue-900/20">
              <CardContent className="p-12 sm:p-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Prêt à digitaliser votre agence ?
                </h2>
                <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg">
                  Rejoignez les agences de location marocaines qui font confiance à Location Voiture.
                  Aucune carte de crédit requise.
                </p>
                <Link href="/register">
                  <Button size="lg" className="h-14 px-8 text-lg bg-white text-blue-900 hover:bg-slate-100 font-bold w-full sm:w-auto">
                    Démarrer maintenant — C'est gratuit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                LV
              </div>
              <p className="text-sm text-slate-500">
                © 2026 Location Voiture. Tous droits réservés.
              </p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
