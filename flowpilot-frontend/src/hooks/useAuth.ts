import { useAuthStore } from "@/stores/auth";
import { User } from "@/types";

export function useAuth() {
  const { user, setUser, logout } = useAuthStore();

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call an API
    if (email && password) {
      const mockUser: User = {
        id: "user-1",
        name: "John Doe",
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: "owner",
        department: "Engineering",
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", "mock-token-" + Date.now());
      return { success: true, user: mockUser };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock register
    if (name && email && password) {
      const mockUser: User = {
        id: "user-" + Date.now(),
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: "owner",
        department: "Engineering",
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", "mock-token-" + Date.now());
      return { success: true, user: mockUser };
    }
    return { success: false, error: "Invalid input" };
  };

  const logoutUser = () => {
    logout();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!user;
  const isLoading = false;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: logoutUser,
  };
}
