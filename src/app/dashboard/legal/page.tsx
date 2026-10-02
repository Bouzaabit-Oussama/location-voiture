export default function LegalPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Juridique</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Contrats, fiche de police DGSN et infractions NARSA
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-3xl mb-3">📄</p>
          <h3 className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>Contrats PDF</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Génération bilingue FR/AR avec rendu BiDi
          </p>
        </div>
        <div className="card">
          <p className="text-3xl mb-3">🏛️</p>
          <h3 className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>Fiche de police</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Export DGSN conforme avec polices Amiri/Cairo
          </p>
        </div>
        <div className="card">
          <p className="text-3xl mb-3">📡</p>
          <h3 className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>Infractions NARSA</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Cross-référencement radar et transfert de responsabilité
          </p>
        </div>
      </div>
    </div>
  );
}
