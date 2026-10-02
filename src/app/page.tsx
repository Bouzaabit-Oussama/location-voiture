import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
              >
                FM
              </div>
              <span className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                Fleet<span style={{ color: "var(--color-primary)" }}>MA</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="btn btn-ghost"
                style={{ fontSize: "0.875rem" }}
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(30, 64, 175, 0.15), transparent)",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div
                className="badge badge-info mb-6"
                style={{ fontSize: "0.8rem", padding: "4px 16px" }}
              >
                🇲🇦 Conçu pour le marché marocain
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
                style={{ color: "var(--color-text)", lineHeight: 1.1 }}
              >
                Gérez votre flotte de
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {" "}location de voitures
                </span>
              </h1>
              <p
                className="text-lg sm:text-xl mb-10"
                style={{ color: "var(--color-text-muted)", maxWidth: "600px", margin: "0 auto 2.5rem" }}
              >
                Réservations, inspections, contrats et conformité CNDP — tout en une seule plateforme.
                Fonctionne hors ligne. Prêt pour la saison MRE.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="btn btn-primary"
                  style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}
                >
                  Commencer gratuitement →
                </Link>
                <Link
                  href="#features"
                  className="btn btn-outline"
                  style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}
                >
                  Découvrir les fonctionnalités
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20" style={{ background: "var(--color-bg-card)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
                Tout ce dont vous avez besoin
              </h2>
              <p style={{ color: "var(--color-text-muted)" }}>
                Une plateforme complète pour les agences de location au Maroc
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "🚗",
                  title: "Gestion de flotte",
                  description: "Suivi en temps réel, visite technique, assurance et vignette. Conformité Ministère du Transport.",
                },
                {
                  icon: "📅",
                  title: "Réservations intelligentes",
                  description: "Moteur anti double-réservation. Tarifs saisonniers automatiques pour la période MRE.",
                },
                {
                  icon: "📱",
                  title: "Inspection hors ligne",
                  description: "Application PWA fonctionnant sans internet. Synchronisation automatique au retour en ligne.",
                },
                {
                  icon: "📄",
                  title: "Contrats en arabe",
                  description: "Génération PDF bilingue (FR/AR) avec mise en page BiDi conforme DGSN.",
                },
                {
                  icon: "🛡️",
                  title: "Conformité CNDP",
                  description: "Protection des données personnelles conforme à la Loi 09-08. Hachage SHA-256 des CIN.",
                },
                {
                  icon: "📊",
                  title: "Tableau de bord SaaS",
                  description: "Multi-agence, facturation ICE/IF/RC, réseau de mauvais payeurs décentralisé.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div
              className="card"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                border: "none",
                padding: "3rem 2rem",
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Prêt à digitaliser votre agence ?
              </h2>
              <p className="text-blue-200 mb-8 max-w-lg mx-auto">
                Rejoignez les agences de location marocaines qui font confiance à Location Voiture.
                Aucune carte de crédit requise.
              </p>
              <Link
                href="/register"
                className="btn"
                style={{
                  background: "white",
                  color: "var(--color-primary-dark)",
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Démarrer maintenant — C&apos;est gratuit
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--color-border)", padding: "2rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              © 2026 Location Voiture. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Politique de confidentialité
              </a>
              <a href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Conditions d&apos;utilisation
              </a>
              <a href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
