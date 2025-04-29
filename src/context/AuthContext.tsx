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
  isAuthenticated: boolean;
  login: (email: string, password: string, token: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to decode JWT token
const decodeToken = (token: string): { sub: string; role: string } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Check for stored token and user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        const userData: User = {
          id: decodedToken.sub,
          email: decodedToken.sub,
          name: decodedToken.sub.split('@')[0], // Use email username as name
          role: decodedToken.role.toLowerCase() as UserRole,
        };
        setUser(userData);
      } else {
        // If token is invalid, remove it
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, token: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        throw new Error("Invalid token");
      }

      const userData: User = {
        id: decodedToken.sub,
        email: decodedToken.sub,
        name: decodedToken.sub.split('@')[0], // Use email username as name
        role: decodedToken.role.toLowerCase() as UserRole,
      };

      setUser(userData);
      localStorage.setItem("token", token);
      
      // Redirect based on role
      if (userData.role === "patient") {
        navigate("/dashboard");
      } else if (userData.role === "doctor") {
        navigate("/dashboard");
      } else if (userData.role === "admin") {
        navigate("/dashboard");
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
        navigate("/dashboard");
      } else if (role === "admin") {
        navigate("/dashboard");
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
    localStorage.removeItem("token");
    localStorage.removeItem("mediq_user");
    navigate("/");
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
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
