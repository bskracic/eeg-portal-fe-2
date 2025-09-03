import { type RegisterRequest } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";


export const authService = {
  register(userData: RegisterRequest): Promise<void> {
    const authStore = useAuthStore();

    return authStore.register(userData);
  },

  login(username: string, password: string) {
    const authStore = useAuthStore();

    authStore.login(username, password);
  },

  logout() {
    const authStore = useAuthStore();

    authStore.logout();
  },

  checkAuth() {
    const authStore = useAuthStore();

    authStore.initializeAuth(); // This will handle checking localStorage and setting store state
    return authStore.isAuthenticated();
  },

  getRole() {
    const authStore = useAuthStore();

    return authStore.role;
  },
};
