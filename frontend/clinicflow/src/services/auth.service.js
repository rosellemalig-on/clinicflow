import * as authApi from "@/api/authApi";

const SESSION_KEY = "clinicflow_session_user_v2";

function notifySessionChange() {
  window.dispatchEvent(new Event("clinicflow:session"));
}

export const authService = {
  currentUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async login(email, password, role) {
    const user = await authApi.login({ email, password, role });
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    notifySessionChange();
    return user;
  },

  async register(data) {
    const user = await authApi.register({
      name: data.name,
      email: data.email,
      contactNumber: data.contactNumber,
      password: data.password,
    });
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    notifySessionChange();
    return user;
  },

  async registerStaff(data) {
    const user = await authApi.registerStaff({
      name: data.name,
      email: data.email,
      contactNumber: data.contactNumber,
      password: data.password,
      accessCode: data.accessCode,
    });
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    notifySessionChange();
    return user;
  },

  updateSessionUser(partial) {
    const current = this.currentUser();
    if (!current) return null;
    const updated = { ...current, ...partial };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    notifySessionChange();
    return updated;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    notifySessionChange();
  },
};
