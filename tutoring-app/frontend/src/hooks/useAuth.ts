import { useAuthStore } from '../contexts/authStore';

export function useAuth() {
  const auth = useAuthStore();

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    updateUserName: auth.updateUserName,
    logout: auth.logout,
    clearError: auth.clearError,
  };
}
