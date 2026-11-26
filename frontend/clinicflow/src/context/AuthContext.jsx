/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authService } from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.currentUser());

  const syncUser = useCallback(() => {
    setUser(authService.currentUser());
  }, []);

  useEffect(() => {
    window.addEventListener("clinicflow:session", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("clinicflow:session", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [syncUser]);

  const login = useCallback(async (email, password, role) => {
    const loggedIn = await authService.login(email, password, role);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (data) => {
    const created = await authService.register(data);
    setUser(created);
    return created;
  }, []);

  const registerStaff = useCallback(async (data) => {
    const created = await authService.registerStaff(data);
    setUser(created);
    return created;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, registerStaff, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return ctx;
}

export default AuthContext;
