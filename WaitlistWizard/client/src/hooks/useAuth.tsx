import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Define the User type based on our schema
interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  userType: "customer" | "provider" | "both";
  profileImage?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: () => {},
  logout: () => {},
  signIn: async () => { throw new Error("Not implemented"); },
  signOut: async () => { throw new Error("Not implemented"); },
  signUp: async () => { throw new Error("Not implemented"); },
  signInWithGoogle: async () => { throw new Error("Not implemented"); },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for stored user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("eventique_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("eventique_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("eventique_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("eventique_user");
    
    // Clear any user-related queries from the cache
    queryClient.clear();
  };

  // Firebase Auth simulation methods
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Here we would normally call Firebase Auth
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const userData = await response.json();
      login(userData.user);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Here we would normally call Firebase Auth
      logout();
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Here we would normally call Firebase Auth
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const userData = await response.json();
      return { uid: userData.id };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Here we would normally call Firebase Auth
      const response = await fetch('/api/auth/google', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Google sign-in failed');
      }
      
      const userData = await response.json();
      login(userData.user);
      return { 
        isNewUser: userData.isNewUser,
        user: userData.user
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      login, 
      logout,
      signIn,
      signOut,
      signUp,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};