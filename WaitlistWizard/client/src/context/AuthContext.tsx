import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  signInWithEmail, 
  createUserWithEmail, 
  signInWithGoogle as firebaseSignInWithGoogle, 
  signOut as firebaseSignOut,
  onAuthStateChange,
  getCurrentUser
} from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';

// User type that extends FirebaseUser with our custom fields
interface User extends Partial<FirebaseUser> {
  id?: number;
  fullName?: string;
  username?: string;
  userType?: 'customer' | 'provider' | 'both';
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => ({}),
  signInWithGoogle: async () => ({}),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from our API
  const fetchUserData = async (email: string) => {
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const userData = await response.json();
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch additional data from our backend
        const userData = await fetchUserData(firebaseUser.email || '');
        if (userData) {
          // Combine Firebase user with our user data
          setUser({
            ...firebaseUser,
            ...userData,
          });
        } else {
          // Just use Firebase user data (this can happen during user creation)
          setUser(firebaseUser);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  // Sign in method
  const signIn = async (email: string, password: string) => {
    await signInWithEmail(email, password);
    // The auth state listener will handle updating the user
  };

  // Sign up method
  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmail(email, password);
    return result.user;
    // After sign up, the user should be created in our backend separately
  };

  // Google sign in method
  const signInWithGoogle = async () => {
    const result = await firebaseSignInWithGoogle();
    const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
    
    return {
      user: result.user,
      isNewUser,
    };
    // If it's a new user, they should be created in our backend separately
  };

  // Sign out method
  const signOut = async () => {
    await firebaseSignOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
