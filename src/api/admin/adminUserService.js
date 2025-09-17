// src/api/admin/adminUserService.js
import http from "@/api/http";

// Tüm kullanıcıları getir
export function getAllUsers(params = {}) {
  return http.get("/admin/users",{params});
}

// Yeni kullanıcı oluştur
export function createUser(payload) {
  return http.post("/admin/users", payload);
}

// Kullanıcı rolünü güncelle
export function updateUserRole(id, roleId) {
  return http.patch(`/admin/users/${id}/role`, { role_id: roleId });
}

// Kullanıcı sil
export function deleteUser(id) {
  return http.delete(`/admin/users/${id}`);
}

// Kullanıcı aktivitelerini getir
export function getUserActivity(id) {
  return http.get(`/admin/users/${id}/activity`);
}
