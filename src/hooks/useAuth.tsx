// src/hooks/useAuth.tsx
/**
 * Auth hook — built with React Query + Zustand.
 *
 * Key fixes vs. the original:
 *  1. useTokenStorage() is no longer called inside a Zustand factory function
 *     (calling hooks outside React components is illegal and crashes at runtime).
 *     Token helpers are now imported as plain async utilities.
 *  2. Session validation is a React Query query, giving us caching + background
 *     refresh for free.
 *  3. The Zustand store only holds derived UI state (user object) — the source
 *     of truth for the token lives in AsyncStorage.
 */
import { create } from "zustand";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { queryKeys } from "@/lib/queryKeys";
import { loginUser, registerUser, type LoginPayload } from "@/services/api.service";
import type { AuthData, AuthStore, JwtPayload } from "@/types";

// ── Token helpers (plain async functions, not hooks) ─────────────────────────

export const tokenStorage = {
  get: () => AsyncStorage.getItem("token").catch(() => null),
  set: (t: string) => AsyncStorage.setItem("token", t),
  remove: () => AsyncStorage.removeItem("token"),
};

// ── Zustand store (UI state only) ────────────────────────────────────────────
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loading: false,
  setUser: (data) => set({ user: data }),
  logout: async () => {
    await tokenStorage.remove();
    set({ user: null, token: null, loading: false });
  },
  // validateSession kept for interface compat — real logic is in useSession()
  validateSession: async () => {},
}));

// ── useSession ───────────────────────────────────────────────────────────────
// Call this once at the app root (e.g. in the index/splash screen) to
// rehydrate the user from a stored JWT.

export function useSession() {
  const { setUser, logout } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: async (): Promise<AuthData | null> => {
      const token = await tokenStorage.get();
      if (!token) return null;

      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
        await tokenStorage.remove();
        return null;
      }

      return {
        id: decoded.id,
        first_name: decoded.first_name || "",
        last_name: decoded.last_name || "",
        email: decoded.email,
        role: decoded.role,
      };
    },
    // Run once on mount; no background polling for session checks
    staleTime: Infinity,
    // Populate the Zustand store as a side-effect so other stores can
    // read user data synchronously if they need to
    select: (user) => {
      setUser(user);
      return user;
    },
  });
}

// ── useLogin ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: async (data) => {
      const token = data.token ?? data.user?.token;
      if (token) {
        await tokenStorage.set(token);
        // Invalidate the session query so useSession re-reads the new token
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
      }
      setUser(data.user);
      router.replace("/(tabs)");
    },
  });
}

// ── useRegister ──────────────────────────────────────────────────────────────

export function useRegister() {
  return useMutation({
    mutationFn: (formData: FormData) => registerUser(formData),
  });
}

// ── useLogout ────────────────────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await logout();
      // Clear all cached data on logout so a different user doesn't see stale data
      queryClient.clear();
    },
    onSuccess: () => {
      router.replace("/auth/login");
    },
  });
}