import http from "./http";

export const getCategories = () => http.get("/categories");
export const getCategoryById = (id) => http.get(`/categories/${id}`);
export const getCategoryBySlug = (slug) => http.get(`/categories/slug/${slug}`);
