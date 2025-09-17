import http from "@/api/http";

// 1. En çok beğenilen haberler
export async function getTopLikedPosts(limit = 10) {
  const res = await http.get("/admin/saved-posts/top", { params: { limit } });
  return res.data;
}

// 2. Belirli kullanıcının kaydettiği haberler
export async function getUserSavedPosts(userId) {
  const res = await http.get(`/admin/saved-posts/${userId}`);
  return res.data;
}

// 3. Belirli kullanıcının kaydetme istatistikleri
export async function getUserSavedStats(userId) {
  const res = await http.get(`/admin/saved-posts/${userId}/stats`);
  return res.data;
}
