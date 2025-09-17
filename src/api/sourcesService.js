import http from "./http";

export const getSources = () => http.get("/sources");
export const getActiveSources = () => http.get("/sources/active");
export const getSourceById = (id) => http.get(`/sources/${id}`);

export const createSource = (payload) => http.post("/sources", payload);
export const updateSource = (id, payload) => http.put(`/sources/${id}`, payload);
export const deleteSource = (id) => http.delete(`/sources/${id}`);
