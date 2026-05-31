import axios from "axios";
import { router } from "expo-router";
import { useAuthStore } from "@/hooks/useAuth";

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "",
};

const api = axios.create({
  baseURL: config.apiUrl, 
  headers: {
    "Content-Type": "application/json",
  },
});

interface API {
  getAccessToken: () => Promise<string | null>;
  setAccessToken: (token: string) => Promise<void>;
  removeAccessToken: () => Promise<void>;
}

export const setupInterceptors = ({ getAccessToken, setAccessToken, removeAccessToken }: API) => {
  api.interceptors.request.use(
    async (config) => {
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    async (response) => {
      const accessToken = response.data?.token;
      if (accessToken) {
        await setAccessToken(accessToken);
      }
      return response;
    },
    async (error) => {
      if (error.response?.status === 401) {
        await removeAccessToken();
        useAuthStore.getState().logout();
        router.replace("/auth/login");
      }
      return Promise.reject(error);
    }
  );
};

export default api;

