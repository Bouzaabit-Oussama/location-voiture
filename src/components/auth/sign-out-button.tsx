"use client";

import { signOut } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="btn btn-ghost"
      style={{
        padding: "4px 8px",
        fontSize: "0.75rem",
        color: "rgba(255,255,255,0.5)",
      }}
      title="Se déconnecter"
    >
      ↗
    </button>
  );
}
