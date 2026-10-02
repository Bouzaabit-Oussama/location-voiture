export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Tableau de bord
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Véhicules actifs", value: "0", icon: "🚗", change: null },
          { label: "Réservations ce mois", value: "0", icon: "📅", change: null },
          { label: "Chiffre d'affaires", value: "0 MAD", icon: "💰", change: null },
          { label: "Taux d'occupation", value: "0%", icon: "📊", change: null },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              {stat.change && (
                <span className="badge badge-success">{stat.change}</span>
              )}
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              {stat.value}
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text)" }}>
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary">+ Nouvelle réservation</button>
          <button className="btn btn-outline">+ Ajouter un véhicule</button>
          <button className="btn btn-outline">+ Nouveau client</button>
          <button className="btn btn-ghost">Lancer une inspection</button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text)" }}>
          Activité récente
        </h2>
        <div
          className="text-center py-12"
          style={{ color: "var(--color-text-muted)" }}
        >
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">Aucune activité pour le moment</p>
          <p className="text-xs mt-1">
            Commencez par ajouter vos véhicules et créer votre première réservation
          </p>
        </div>
      </div>
    </div>
  );
}
