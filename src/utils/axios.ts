import axios from "axios";

const API_BASE_URL = "http://127.1.1.1:2004/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Évita boucles de refresh infinies et écrasement de la session
let isRefreshing = false;
let failedQueue: { config: any; resolve: (v: any) => void; reject: (e: any) => void }[] = [];

const clearSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const redirectToLogin = () => {
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
  }
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Ne traite que les 401 sur les endpoints API (jamais sur /auth/* pour éviter les boucles)
    if (status !== 401 || original._retry || !String(original.url).includes('/api/') || String(original.url).includes('/api/auth/')) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return Promise.reject(error);

    original._retry = true;

    // Un refresh est déjà en cours → on met la requête en file d'attente
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ config: original, resolve, reject });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
      const newToken = data.data?.accessToken;
      if (!newToken) throw new Error('No access token in refresh response');

      localStorage.setItem("accessToken", newToken);

      // Retente les requêtes en attente avec le nouveau token
      failedQueue.forEach(({ config, resolve, reject }) => {
        try {
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(config));
        } catch (e) {
          reject(e);
        }
      });
      failedQueue = [];

      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch {
      // Refresh échoué → la session est terminée, on nettoie uniquement les clés auth
      clearSession();
      failedQueue.forEach(({ reject }) => reject(error));
      failedQueue = [];
      redirectToLogin();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
