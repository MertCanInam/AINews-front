import http from "./http";

// Kullanıcı giriş
export const login = (email, password) =>
  http.post("/auth/login", { email, password });

// Yeni kullanıcı kayıt
export const register = (first_name, last_name, email, password) =>
  http.post("/auth/register", { first_name, last_name, email, password });

// Giriş yapan kullanıcının bilgileri
export const me = () => http.get("/auth/me");

// Çıkış
export const logoutApi = () => http.post("/auth/logout");

// Access Token yenileme — body yok, cookie otomatik gider
export const refresh = () => http.post("/auth/refresh-token");
