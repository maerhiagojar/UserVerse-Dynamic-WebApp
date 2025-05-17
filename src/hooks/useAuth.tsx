
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define User type
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

// Define Auth Context type
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if admin credentials
      if (email === "admin@admin.com" && password === "admin123") {
        const adminUser = {
          id: 999,
          name: "Administrator",
          username: "admin",
          email: "admin@admin.com",
          isAdmin: true,
        };

        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);
        toast({
          title: "Logged in as Administrator",
          description: "Welcome back, Admin!",
        });
        navigate("/dashboard");
        return;
      }

      // For regular users, validate against the JSON placeholder users
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = await response.json();

      // Find user by email and validate password (which is the username in this mock setup)
      const foundUser = users.find(
        (user: any) => user.email.toLowerCase() === email.toLowerCase() && user.username === password
      );

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          username: foundUser.username,
          email: foundUser.email,
          isAdmin: false,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
