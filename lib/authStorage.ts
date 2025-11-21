const TOKEN_KEY = "token";
const EMAIL_KEY = "userEmail";

const safeWindow = () => (typeof window === "undefined" ? null : window);

export const AuthStorage = {
  getToken: () => {
    try {
      return safeWindow()?.localStorage.getItem(TOKEN_KEY) ?? null;
    } catch {
      return null;
    }
  },
  setToken: (token: string) => {
    try {
      safeWindow()?.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /** swallow */
    }
  },
  removeToken: () => {
    try {
      safeWindow()?.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /** swallow */
    }
  },
  getUserEmail: () => {
    try {
      return safeWindow()?.localStorage.getItem(EMAIL_KEY) ?? null;
    } catch {
      return null;
    }
  },
  setUserEmail: (email: string) => {
    try {
      safeWindow()?.localStorage.setItem(EMAIL_KEY, email);
    } catch {
      /** swallow */
    }
  },
  removeUserEmail: () => {
    try {
      safeWindow()?.localStorage.removeItem(EMAIL_KEY);
    } catch {
      /** swallow */
    }
  },
  clearSession: () => {
    try {
      const win = safeWindow();
      win?.localStorage.removeItem(TOKEN_KEY);
      win?.localStorage.removeItem(EMAIL_KEY);
    } catch {
      /** swallow */
    }
  },
};

