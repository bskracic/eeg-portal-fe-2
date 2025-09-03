import type { RegisterRequest } from "@/api/auth";
import { authApi } from "@/api/auth";
import i18n from "@/i18n";
import router from "@/router";
import { storage } from "@/services/storageService";
import { defineStore } from "pinia";
import { ref } from "vue";

const { t } = i18n.global;

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const username = ref<string | null>(null);
  const role = ref<string | null>(null);
  const error = ref<string | null>(null);
  const loading = ref(false);

  const setAccessToken = (newToken: string) => {
    accessToken.value = newToken;
    storage.set("access", newToken);
  };

  const setRefreshToken = (newToken: string) => {
    refreshToken.value = newToken;
    storage.set("refresh", newToken);
  };

  const setUsername = (newUsername: string) => {
    username.value = newUsername;
    storage.set("username", newUsername);
  };

  const setRole = (newRole: string) => {
    role.value = newRole;
    storage.set("role", newRole);
  }

  const setError = (newError: string | null) => {
    error.value = newError;
  };

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading;
  };

  const clearError = () => {
    error.value = null;
  };

  const clearAuth = () => {
    accessToken.value = null;
    refreshToken.value = null;
    username.value = null;
    role.value = null;
    error.value = null;
    storage.remove("access");
    storage.remove("refresh");
    storage.remove("username");
    storage.remove("role");
  };

  const isAuthenticated = () => !!accessToken.value;

  const isAdmin = () => accessToken.value && role.value === "admin";

  const initializeAuth = () => {
    const storedAccessToken = storage.get("access");
    const storedRefreshToken = storage.get("refresh");
    const storedUsername = storage.get("username");
    const storedRole = storage.get("role");

    if (
      storedAccessToken &&
      storedRefreshToken &&
      storedUsername &&
      storedRole
    ) {
      accessToken.value = storedAccessToken;
      refreshToken.value = storedRefreshToken;
      username.value = storedUsername;
      role.value = storedRole;
    }
  };

  // login
  const login = async (username: string, password: string) => {
    setLoading(true);
    clearError();

    try {
      const response = await authApi.login({
        username,
        password,
      });
      setAccessToken(response.access);
      setRefreshToken(response.refresh);
      setRole(response.role);
      setUsername(username);

      router.push('/dashboard'); // TODO: does not work for some reason?

    } catch (error: any) {
      let errorMessage = "";
      if (error.response?.status === 401) {
        errorMessage = t(error.response.data.message ?? t("auth.login.invalidCredentials"));
      } else {
        errorMessage = t("auth.login.failed");
      }

      setError(errorMessage);
    } finally {
      setLoading(false);

    }
  };

  const logout = () => {
    clearAuth();
  };

  // register
  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    clearError();

    try {
      await authApi.register(userData);
    } catch (error: any) {
      let errorMessage = t("auth.register.failed");
      if (error.response?.status === 400) {
        if (error.response.data[1].code === "DuplicateEmail") {
          errorMessage = t("auth.register.duplicateEmail");
        }
      }
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    accessToken,
    refreshToken,
    username,
    role,
    error,
    loading,
    login,
    logout,
    initializeAuth,
    isAuthenticated,
    isAdmin,
    setAccessToken,
    setRefreshToken,
    setUsername,
    setRole,
    setError,
    setLoading,
    clearError,
    clearAuth,
    register,
  };
});
