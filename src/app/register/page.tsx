"use client";

import { useActionState } from "react";
import { signUp, type AuthState } from "@/app/actions/auth";
import Link from "next/link";

const initialState: AuthState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  // Success state — email confirmation sent
  if (state.success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(30, 64, 175, 0.15), var(--color-bg))",
        }}
      >
        <div className="w-full max-w-md animate-fade-in text-center">
          <div className="card" style={{ padding: "3rem 2rem" }}>
            <div className="text-5xl mb-4">📧</div>
            <h1
              className="text-xl font-bold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              Vérifiez votre email
            </h1>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-text-muted)" }}
            >
              Un lien de confirmation a été envoyé à votre adresse email.
              Cliquez dessus pour activer votre compte.
            </p>
            <Link href="/login" className="btn btn-primary">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(30, 64, 175, 0.15), var(--color-bg))",
      }}
    >
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
              }}
            >
              FM
            </div>
          </Link>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Créer votre agence
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Inscrivez votre agence de location sur FleetMA
          </p>
        </div>

        {/* Registration Form */}
        <div className="card" style={{ padding: "2rem" }}>
          {/* Error Alert */}
          {state.error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{
                background: "var(--color-danger)",
                color: "white",
                opacity: 0.95,
              }}
            >
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--color-text)" }}
              >
                Votre nom complet
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Mohammed Alaoui"
                className="input"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label
                htmlFor="agency_name"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--color-text)" }}
              >
                Nom de l&apos;agence
              </label>
              <input
                id="agency_name"
                name="agency_name"
                type="text"
                placeholder="Ex: Atlas Car Rental"
                className="input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-text)" }}
                >
                  Ville
                </label>
                <select id="city" name="city" className="input" required>
                  <option value="">Choisir...</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Fès">Fès</option>
                  <option value="Oujda">Oujda</option>
                  <option value="Nador">Nador</option>
                  <option value="Meknès">Meknès</option>
                  <option value="Tétouan">Tétouan</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-text)" }}
                >
                  Téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  className="input"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--color-text)" }}
              >
                Email professionnel
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="contact@votre-agence.ma"
                className="input"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--color-text)" }}
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 caractères"
                className="input"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="cndp_consent"
                name="cndp_consent"
                className="mt-1 rounded"
                required
              />
              <label
                htmlFor="cndp_consent"
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                J&apos;accepte les conditions d&apos;utilisation et je consens
                au traitement de mes données conformément à la Loi 09-08
                relative à la protection des personnes physiques (CNDP).
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary w-full"
              style={{ padding: "0.75rem", opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? (
                <span className="animate-pulse-gentle">Création en cours...</span>
              ) : (
                "Créer mon agence"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Déjà inscrit ?{" "}
              <Link
                href="/login"
                className="font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
