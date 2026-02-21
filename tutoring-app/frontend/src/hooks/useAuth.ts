import { useAuthStore } from '../contexts/authStore';

export function useAuth() {
  const auth = useAuthStore();

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isRehydrating: auth.isRehydrating,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    clearError: auth.clearError,
    refreshProfile: auth.refreshProfile,
  };
}
