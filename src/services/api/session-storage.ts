import type { AuthSession } from "@/types/api";

// Where the logged-in session is kept in the browser.
// If the backend switches to httpOnly cookies, only this file needs to change.
const SESSION_KEY = "hs.session";
const PENDING_VERIFICATION_KEY = "hs.pending-verification";
const PENDING_RESET_KEY = "hs.pending-reset";

const isBrowser = () => typeof window !== "undefined";

function read<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked (private mode) — the session simply won't persist
  }
}

export const sessionStore = {
  get(): AuthSession | null {
    if (!isBrowser()) return null;
    const session = read<AuthSession>(localStorage, SESSION_KEY) ?? read<AuthSession>(sessionStorage, SESSION_KEY);
    if (session && new Date(session.expiresAt).getTime() < Date.now()) {
      this.clear();
      return null;
    }
    return session;
  },
  set(session: AuthSession, remember: boolean) {
    if (!isBrowser()) return;
    this.clear();
    write(remember ? localStorage : sessionStorage, SESSION_KEY, session);
  },
  clear() {
    if (!isBrowser()) return;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  },
  token(): string | null {
    return this.get()?.accessToken ?? null;
  },
};

export interface PendingVerification {
  userId: string;
  name: string;
  email: string;
  mobile: string;
}

export interface PendingReset {
  identifier: string;
  identifierType: "email" | "mobile";
  maskedTarget: string;
}

export const flowStore = {
  getVerification: () => (isBrowser() ? read<PendingVerification>(sessionStorage, PENDING_VERIFICATION_KEY) : null),
  setVerification: (value: PendingVerification) => isBrowser() && write(sessionStorage, PENDING_VERIFICATION_KEY, value),
  clearVerification: () => isBrowser() && sessionStorage.removeItem(PENDING_VERIFICATION_KEY),
  getReset: () => (isBrowser() ? read<PendingReset>(sessionStorage, PENDING_RESET_KEY) : null),
  setReset: (value: PendingReset) => isBrowser() && write(sessionStorage, PENDING_RESET_KEY, value),
  clearReset: () => isBrowser() && sessionStorage.removeItem(PENDING_RESET_KEY),
};
