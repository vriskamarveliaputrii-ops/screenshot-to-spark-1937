import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { mockUsers } from "@/mocks/users";
import type { User } from "@/types";

interface AuthCtx {
  user: User | null;
  ready: boolean;
  isAdmin: boolean;
  setUser: (u: User | null) => void;
  switchRole: () => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "swm-mock-user";

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUserState(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  }, []);

  const switchRole = useCallback(() => {
    const next = mockUsers.find((u) => u.role === (user?.role === "admin" ? "user" : "admin"))!;
    setUser({ ...next });
  }, [user, setUser]);

  return (
    <Ctx.Provider value={{ user, ready, isAdmin: user?.role === "admin", setUser, switchRole, logout: () => setUser(null) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useMockAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMockAuth must be used within MockAuthProvider");
  return c;
}
