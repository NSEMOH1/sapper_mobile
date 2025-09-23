import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "",
};

const api = axios.create({
  baseURL: "http://localhost:3001", 
  headers: {
    "Content-Type": "application/json",
  },
});

interface API {
  getAccessToken: () => Promise<string | null>;
  setAccessToken: (token: string) => Promise<void>;
}

export const setupInterceptors = ({ getAccessToken, setAccessToken }: API) => {
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
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default api;

export const useTokenStorage = () => {
  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (e) {
      console.error("Failed to get token:", e);
      return null;
    }
  };

  const setAccessToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("token", token);
    } catch (e) {
      console.error("Failed to set token:", e);
    }
  };

  const removeAccessToken = async () => {
    try {
      await AsyncStorage.removeItem("token");
    } catch (e) {
      console.error("Failed to remove token:", e);
    }
  };

  return { getAccessToken, setAccessToken, removeAccessToken };
};
