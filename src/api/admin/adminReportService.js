import http from "@/api/http";

// 1. Günlük çekilen haber sayısı trendi
export async function getDailyPostTrends(limit = 7) {
  const res = await http.get("/admin/reports/daily-posts", { params: { limit } });
  return res.data;
}

// 2. Kaynak başına haber dağılımı
export async function getPostDistributionBySource() {
  const res = await http.get("/admin/reports/posts-by-source");
  return res.data;
}

// 3. Aylık kullanıcı artışı
export async function getMonthlyUserGrowth() {
  const res = await http.get("/admin/reports/monthly-user-growth");
  return res.data;
}

// 4. En çok ticket açan kullanıcılar
export async function getTopTicketCreators(limit = 5) {
  const res = await http.get("/admin/reports/top-ticket-creators", { params: { limit } });
  return res.data;
}

// 5. En aktif kullanıcılar
export async function getMostActiveUsers(limit = 5) {
  const res = await http.get("/admin/reports/most-active-users", { params: { limit } });
  return res.data;
}
