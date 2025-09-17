import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 🍪 cookie otomatik gönderilsin
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

    // Eğer refresh endpoint'i 401 verirse sonsuz döngüye girmemek için
    const isRefreshCall =
      originalConfig?.url?.includes("/auth/refresh-token") ||
      originalConfig?.url === "http://localhost:5000/api/auth/refresh-token";

    if (error.response?.status === 401 && !originalConfig._retry && !isRefreshCall) {
      originalConfig._retry = true;

      if (isRefreshing) {
        // Devam eden refresh biter bitmez kuyruktakileri yeniden dene
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
        // ⬇️ Artık body’de refreshToken gönderME — cookie otomatik gidiyor
        const { data } = await http.post("/auth/refresh-token");

        const newAccessToken = data.accessToken;

        // sadece access token’ı tutuyoruz
        sessionStorage.setItem("accessToken", newAccessToken);
        setAuthHeader(newAccessToken);

        processQueue(newAccessToken, null);

        // Orijinal isteği yeni access token ile tekrar dene
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
