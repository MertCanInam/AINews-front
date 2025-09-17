import http from "./http";

export async function getSavedPosts() {
  return http.get("/saved-posts");
}

export async function savePost(post_id) {
  return http.post("/saved-posts", { post_id });
}

export async function unsavePost(post_id) {
  return http.delete("/saved-posts", { data: { post_id } });
}

export async function isPostSaved(post_id) {
  return http.get(`/saved-posts/${post_id}`);
}
