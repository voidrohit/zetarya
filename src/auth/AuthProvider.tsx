"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as api from "./api";
import { getValidSession, logout, startSilentRefresh, stopSilentRefresh } from "./session";
import { getAccessToken } from "./tokenStore";
import type { User } from "./types";

export type AuthStatus = "loading" | "signedOut" | "signedIn";

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  /** Called by the auth forms once tokens are stored. */
  completeLogin: (accessToken: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Owns signed-in/out state for the site. Mounted once, in the root layout,
 *  so every page can ask without each one restoring a session of its own. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);

  const loadUser = useCallback(async (token: string) => {
    try {
      setUser(await api.getMe(token));
    } catch {
      // /auth/me is best-effort: the token is valid, the profile can arrive later.
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (token) await loadUser(token);
  }, [loadUser]);

  const completeLogin = useCallback(
    async (accessToken: string) => {
      await loadUser(accessToken);
      startSilentRefresh();
      setStatus("signedIn");
    },
    [loadUser],
  );

  const signOut = useCallback(async () => {
    await logout();
    setUser(null);
    setStatus("signedOut");
  }, []);

  // Restore an existing session on load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await getValidSession();
      if (cancelled) return;
      if (!session) {
        setStatus("signedOut");
        return;
      }
      const token = getAccessToken();
      if (token) await loadUser(token);
      if (cancelled) return;
      startSilentRefresh();
      setStatus("signedIn");
    })();
    return () => {
      cancelled = true;
      stopSilentRefresh();
    };
  }, [loadUser]);

  const value = useMemo(
    () => ({ status, user, completeLogin, refreshUser, signOut }),
    [status, user, completeLogin, refreshUser, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
