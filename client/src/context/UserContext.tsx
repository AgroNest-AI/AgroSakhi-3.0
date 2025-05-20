import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  username: string;
  displayName: string;
  location?: string;
  preferredLanguage?: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Mock authentication for demo purposes
  const defaultUser: User = {
    id: 1,
    username: "priya",
    displayName: "Priya Singh",
    location: "Barabanki, Uttar Pradesh",
    preferredLanguage: "en",
    role: "farmer"
  };

  useEffect(() => {
    // Auto-authenticate with default user for demo
    setUser(defaultUser);
  }, []);

  const { isLoading } = useQuery({
    queryKey: [`/api/users/${defaultUser.id}`],
    enabled: false, // Disable for now, we're using the mock user
    onSuccess: (data) => {
      setUser(data);
    }
  });

  const login = async (username: string, password: string): Promise<User> => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
