import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthState, User, UserRole } from "../types";
import { MOCK_USERS, DEMO_CREDENTIALS } from "../data/mockData";

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [users, setUsers] = useState<User[]>(() => {
    try { const s = localStorage.getItem("veriscan-users"); return s ? (JSON.parse(s) as User[]) : MOCK_USERS; } catch { return MOCK_USERS; }
  });
  useEffect(() => { localStorage.setItem("veriscan-users", JSON.stringify(users)); }, [users]);
  const addUser = (u: Omit<User, "id" | "lastLogin">) =>
    setUsers((c) => [...c, { ...u, id: `u${Date.now()}`, lastLogin: new Date().toISOString() }]);
  const removeUser = (id: string) => setUsers((c) => c.filter((u) => u.id !== id));
  const setUserActive = (id: string, active: boolean) => setUsers((c) => c.map((u) => (u.id === id ? { ...u, isActive: active } : u)));

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate async API call
    await new Promise((r) => setTimeout(r, 800));
    const found = users.find((u) => u.email === email.toLowerCase() && u.isActive);
    if (found && password === "Demo@1234") {
      setUser(found);
      setIsDemoMode(false);
      return true;
    }
    return false;
  };

  const loginAsDemo = (role: UserRole = "officer") => {
    const found = MOCK_USERS.find((u) => u.role === role) ?? MOCK_USERS[0];
    setUser(found);
    setIsDemoMode(true);
  };

  const logout = () => {
    setUser(null);
    setIsDemoMode(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isDemoMode, login, loginAsDemo, logout, users, addUser, removeUser, setUserActive }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { DEMO_CREDENTIALS };
