import http from "./http";

export const getPosts = (page = 1, limit = 10) =>
  http.get(`/posts?page=${page}&limit=${limit}`);

export const getPostById = (id) => http.get(`/posts/${id}`);

export const getPostsByCategory = (categoryId) =>
  http.get(`/categories/${categoryId}/posts`);

export const createPost = (payload) => http.post("/posts", payload);
export const updatePost = (id, payload) => http.put(`/posts/${id}`, payload);
export const updatePostStatus = (id, status) =>
  http.patch(`/posts/${id}/status`, { status });
export const deletePost = (id) => http.delete(`/posts/${id}`);
