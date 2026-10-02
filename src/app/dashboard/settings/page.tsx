export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Paramètres</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Configuration de votre agence
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text)" }}>
            Informations agence
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>ICE</label>
              <input className="input" placeholder="000000000000000" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>IF</label>
              <input className="input" placeholder="Identifiant fiscal" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>RC</label>
              <input className="input" placeholder="Registre du commerce" disabled />
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text)" }}>
            Langue et direction
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Langue</label>
              <select className="input">
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Le choix de l&apos;arabe active automatiquement la mise en page RTL (droite à gauche).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
