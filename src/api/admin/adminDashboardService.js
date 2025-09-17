import http from "@/api/http";

// Admin dashboard istatistiklerini getir
export function getDashboardStats() {
  return http.get("/admin/dashboard");
}
