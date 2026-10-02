"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Tenant, UserProfile } from "@/types";

interface TenantContextType {
  tenant: Tenant | null;
  profile: UserProfile | null;
  isLoading: boolean;
  locale: "fr" | "ar";
  dir: "ltr" | "rtl";
  setLocale: (locale: "fr" | "ar") => void;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  profile: null,
  isLoading: true,
  locale: "fr",
  dir: "ltr",
  setLocale: () => {},
});

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

interface TenantProviderProps {
  children: React.ReactNode;
  initialTenant: Tenant | null;
  initialProfile: UserProfile | null;
}

export function TenantProvider({
  children,
  initialTenant,
  initialProfile,
}: TenantProviderProps) {
  const [tenant] = useState<Tenant | null>(initialTenant);
  const [profile] = useState<UserProfile | null>(initialProfile);
  const [locale, setLocaleState] = useState<"fr" | "ar">("fr");
  const [isLoading] = useState(false);

  const dir = locale === "ar" ? "rtl" : "ltr";

  const setLocale = useCallback((newLocale: "fr" | "ar") => {
    setLocaleState(newLocale);
    // Persist preference
    if (typeof window !== "undefined") {
      localStorage.setItem("location-voiture_locale", newLocale);
    }
  }, []);

  // Apply RTL/LTR to html element dynamically
  useEffect(() => {
    const savedLocale = localStorage.getItem("location-voiture_locale") as "fr" | "ar" | null;
    if (savedLocale) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;

    // Swap font family for Arabic
    if (locale === "ar") {
      document.body.style.fontFamily = "var(--font-arabic)";
    } else {
      document.body.style.fontFamily = "var(--font-sans)";
    }
  }, [locale, dir]);

  return (
    <TenantContext.Provider
      value={{
        tenant,
        profile,
        isLoading,
        locale,
        dir,
        setLocale,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}
