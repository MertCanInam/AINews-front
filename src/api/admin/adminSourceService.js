import http from "@/api/http";

// Tüm kaynakları getir
export function getAllSources() {
  return http.get("/admin/sources");
}

// Yeni kaynak ekle
export function createSource(payload) {
  return http.post("/admin/sources", payload);
}

// Kaynağı güncelle
export function updateSource(id, payload) {
  return http.patch(`/admin/sources/${id}`, payload);
}

// Kaynağı sil
export function deleteSource(id) {
  return http.delete(`/admin/sources/${id}`);
}

// Kaynak loglarını getir (opsiyonel)
export function getSourceLogs(id) {
  return http.get(`/admin/sources/${id}/logs`);
}
