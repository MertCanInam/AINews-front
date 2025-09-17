// src/api/admin/adminProfileService.js
import http from "@/api/http"; // ✅ doğru import

// 1. Profil bilgilerini getir
export async function getProfile() {
  const res = await http.get("/admin/profile");
  return res.data;
}

// 2. Profil güncelle
export async function updateProfile(data) {
  const res = await http.patch("/admin/profile", data);
  return res.data;
}

// 3. Şifre değiştir
export async function changePassword(payload) {
  const res = await http.patch("/admin/profile/change-password", payload);
  return res.data;
}

// 4. Yeni admin ekle
export async function createAdmin(data) {
  const res = await http.post("/admin/profile/create", data);
  return res.data;
}
