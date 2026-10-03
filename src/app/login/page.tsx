"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";
import Link from "next/link";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

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
              LV
            </div>
          </Link>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Bienvenue sur Location Voiture
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Connectez-vous à votre espace agence
          </p>
        </div>

        {/* Login Form */}
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
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--color-text)" }}
              >
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.ma"
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
                placeholder="••••••••"
                className="input"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                <input type="checkbox" className="rounded" />
                Se souvenir de moi
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary w-full"
              style={{ padding: "0.75rem", opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? (
                <span className="animate-pulse-gentle">Connexion en cours...</span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                Créer une agence
              </Link>
            </p>
          </div>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          Protégé par la Loi 09-08 (CNDP) • Données hébergées en UE
        </p>
      </div>
    </div>
  );
}
