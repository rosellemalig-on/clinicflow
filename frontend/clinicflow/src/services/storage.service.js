import { seedState } from "@/data/seed";
import { SESSION_KEY, STORAGE_KEY } from "@/lib/constants";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export const storageService = {
  getState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = clone(seedState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(stored);
    } catch {
      const initial = clone(seedState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
  },
  saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("clinicflow:data"));
  },
  getSession() {
    return localStorage.getItem(SESSION_KEY);
  },
  setSession(userId) {
    localStorage.setItem(SESSION_KEY, userId);
    window.dispatchEvent(new Event("clinicflow:session"));
  },
  clearSession() {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("clinicflow:session"));
  },
};
