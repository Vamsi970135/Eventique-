import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const { user, loading, signUp, signInWithGoogle } = useAuth();
  const [location, navigate] = useLocation();
  const [isProvider, setIsProvider] = useState(false);

  // Check if URL has the 'provider' query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'provider') {
      setIsProvider(true);
    }
  }, []);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!loading && user) {
      if (user.userType === 'provider' || user.userType === 'both') {
        navigate("/dashboard/provider");
      } else {
        navigate("/dashboard/user");
      }
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (email: string, password: string, fullName: string, username: string) => {
    try {
      setError(null);
      
      // Create user with Firebase Auth
      const userType = isProvider ? 'provider' : 'customer';
      const firebaseUser = await signUp(email, password);
      
      // Create user in our backend
      await apiRequest('POST', '/api/users', {
        email,
        username,
        password: 'firebase-auth-user', // We don't store the actual password
        fullName,
        userType,
        firebaseUid: firebaseUser.uid
      });
      
    } catch (err: any) {
      console.error("Registration error:", err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email address");
      } else {
        setError(err.message || "An error occurred during registration");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      
      // Sign in with Google using Firebase Auth
      const result = await signInWithGoogle();
      
      // If it's a new user, create the user in our backend
      if (result.isNewUser) {
        const userType = isProvider ? 'provider' : 'customer';
        const { user } = result;
        
        await apiRequest('POST', '/api/users', {
          email: user.email,
          username: user.email.split('@')[0], // Generate a username from email
          password: 'firebase-auth-user', // We don't store the actual password
          fullName: user.displayName || 'User',
          userType,
          firebaseUid: user.uid
        });
      }
      
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err.message || "An error occurred during Google sign-in");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      <main className="py-16 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isProvider ? 'Register as a Provider' : 'Create an Account'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isProvider 
                ? 'Start showcasing your services to potential clients' 
                : 'Join Eventique to find and book event services'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <AuthForm 
            formType="register"
            onSubmit={handleSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            isProvider={isProvider}
          />
        </div>
      </main>
      
      <Footer />
    </>
  );
}
