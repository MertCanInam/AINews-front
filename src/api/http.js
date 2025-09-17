import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export function setAuthHeader(token) {
  if (token) {
    http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common["Authorization"];
  }
}

let isRefreshing = false;
let queue = [];

function processQueue(token = null, error = null) {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  queue = [];
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    const isRefreshCall =
      originalConfig?.url?.includes("/auth/refresh-token") ||
      originalConfig?.url === `${import.meta.env.VITE_API_URL}/auth/refresh-token`;

    if (error.response?.status === 401 && !originalConfig._retry && !isRefreshCall) {
      originalConfig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              if (token) {
                originalConfig.headers["Authorization"] = `Bearer ${token}`;
              }
              resolve(http(originalConfig));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await http.post("/auth/refresh-token");
        const newAccessToken = data.accessToken;

        sessionStorage.setItem("accessToken", newAccessToken);
        setAuthHeader(newAccessToken);

        processQueue(newAccessToken, null);

        originalConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return http(originalConfig);
      } catch (err) {
        processQueue(null, err);
        sessionStorage.clear();
        setAuthHeader(null);
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default http;
