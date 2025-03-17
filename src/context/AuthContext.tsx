
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type UserRole = "patient" | "doctor" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("mediq_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user", err);
        localStorage.removeItem("mediq_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users for testing
      const mockUsers = [
        { id: "p1", name: "John Patient", email: "patient@example.com", password: "password", role: "patient" as UserRole },
        { id: "d1", name: "Dr. Sarah", email: "doctor@example.com", password: "password", role: "doctor" as UserRole },
        { id: "a1", name: "Admin User", email: "admin@example.com", password: "password", role: "admin" as UserRole },
      ];
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Create user without password
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("mediq_user", JSON.stringify(userWithoutPassword));
      
      // Redirect based on role
      if (foundUser.role === "patient") {
        navigate("/dashboard");
      } else if (foundUser.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (foundUser.role === "admin") {
        navigate("/admin-dashboard");
      }
      
      toast.success("Login successful");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user
      const newUser = {
        id: `u${Date.now()}`,
        name,
        email,
        role,
      };
      
      setUser(newUser);
      localStorage.setItem("mediq_user", JSON.stringify(newUser));
      
      // Redirect based on role
      if (role === "patient") {
        navigate("/dashboard");
      } else if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      }
      
      toast.success("Registration successful");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mediq_user");
    navigate("/");
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
