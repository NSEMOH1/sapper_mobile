/**
 * api.ts — Axios instance + interceptor setup
 *
 * ✅ No imports from @/hooks or @/services — this file sits at the bottom
 *    of the dependency graph and must stay cycle-free.
 *
 * The logout side-effect (clear Zustand + navigate) is injected via
 * setupInterceptors() so api.ts never needs to import useAuthStore.
 */
import axios from "axios";
import { router } from "expo-router";

export const config = {
  apiUrl: "https://api.sappersapi.com",
};

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

interface InterceptorAPI {
  getAccessToken: () => Promise<string | null>;
  setAccessToken: (token: string) => Promise<void>;
  removeAccessToken: () => Promise<void>;
  /** Called after token removal on 401 — inject store logout here */
  onUnauthenticated?: () => void;
}

export const setupInterceptors = ({
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  onUnauthenticated,
}: InterceptorAPI) => {
  // ── Request: attach Bearer token ────────────────────────────────────────
  api.interceptors.request.use(
    async (config) => {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ── Response: persist new token / handle 401 ────────────────────────────
  api.interceptors.response.use(
    async (response) => {
      const newToken = response.data?.token;
      if (newToken) {
        await setAccessToken(newToken);
      }
      return response;
    },
    async (error) => {
      if (error.response?.status === 401) {
        await removeAccessToken();
        onUnauthenticated?.();          // ← Zustand logout lives here
        router.replace("/auth/login");
      }
      return Promise.reject(error);
    }
  );
};

export default api;