import { defineStore } from "pinia";
import http, { setAuthHeader } from "@/api/http";
import { logoutApi } from "@/api/authService.js";
import { jwtDecode } from "jwt-decode"; 

function safeParseUser(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("Geçersiz user verisi:", raw);
    localStorage.removeItem("user");
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: safeParseUser(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    roleId: Number(localStorage.getItem("role_id")) || null,
  }),
  actions: {
    async login(credentials) {
      const { data } = await http.post("/auth/login", credentials);
      this.user = data.user;
      this.token = data.accessToken;

      
      if (data.accessToken) {
        const decoded = jwtDecode(data.accessToken);
        this.roleId = decoded?.role_id || null;
        localStorage.setItem("role_id", this.roleId);
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.accessToken);

      setAuthHeader(data.accessToken);
    },

    async fetchMe() {
      try {
        const { data } = await http.get("/auth/me");
        const normalized =
          data?.data ?? data?.user ?? data;

        this.user = normalized ?? null;
        localStorage.setItem("user", JSON.stringify(this.user));

        if (this.user?.role_id) {
          this.roleId = this.user.role_id;
          localStorage.setItem("role_id", this.roleId);
        }
      } catch {
        this.user = null;
        this.token = null;
        this.roleId = null;
        localStorage.clear();
      }
    },

    patchUser(p) {
      this.user = { ...(this.user ?? {}), ...p };
      localStorage.setItem("user", JSON.stringify(this.user));
      if (p.role_id) {
        this.roleId = p.role_id;
        localStorage.setItem("role_id", this.roleId);
      }
    },

    async logoutUser() {
      try {
        await logoutApi();
      } catch (err) {
        console.error("Logout API hatası:", err);
      }
      this.user = null;
      this.token = null;
      this.roleId = null;
      localStorage.clear();
      setAuthHeader(null);
    },
  },
});
