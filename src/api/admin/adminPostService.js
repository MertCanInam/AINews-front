import http from "@/api/http";

export async function getAllPosts({ page = 1, limit = 20, status } = {}) {
  const params = { page, limit };
  if (status) params.status = status;

  const res = await http.get("/admin/posts", { params });
  return res.data; // backend'ten { total, posts, currentPage, totalPages } gelir
}

export async function updatePostStatus(id, status) {
  const res = await http.patch(`/admin/posts/${id}/status`, { status });
  return res.data;
}

export async function deletePost(id) {
  const res = await http.delete(`/admin/posts/${id}`);
  return res.data;
}
