import http from "./http";

// Profil getir/güncelle
export const getMe = () => http.get("/users/me");
export const updateMe = (payload) => http.put("/users/me", payload);

// Şifre değiştir
export const changePassword = (current_password, new_password) =>
  http.put("/users/me/password", { current_password, new_password });

// Email değiştir (onay maili gönderir)
export const requestEmailChange = (new_email) =>
  http.post("/users/me/email-change", { new_email });

// Email onayı (maildeki linkten çağrılır)
export const confirmEmail = (token) =>
  http.get(`/users/confirm-email?token=${token}`);
