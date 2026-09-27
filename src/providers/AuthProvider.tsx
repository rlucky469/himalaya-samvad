"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { sessionStore } from "@/services/api/session-storage";
import { authService } from "@/services/auth.service";
import type { AuthSession, AuthUser } from "@/types/api";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  signIn: (session: AuthSession, remember?: boolean) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Session lives in browser storage, so it is read after hydration
  useEffect(() => {
    const stored = sessionStore.get();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from browser storage
    setSession(stored);
    setStatus(stored ? "authenticated" : "anonymous");

    const onStorage = () => {
      const next = sessionStore.get();
      setSession(next);
      setStatus(next ? "authenticated" : "anonymous");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback((next: AuthSession, remember = true) => {
    sessionStore.set(next, remember);
    setSession(next);
    setStatus("authenticated");
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // logging out locally is enough if the server call fails
    }
    sessionStore.clear();
    setSession(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(() => ({ status, user: session?.user ?? null, signIn, signOut }), [status, session, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
