import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const { user, loading, signIn, signInWithGoogle } = useAuth();
  const [location, navigate] = useLocation();

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

  const handleSubmit = async (email: string, password: string) => {
    try {
      setError(null);
      await signIn(email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed login attempts. Please try again later.");
      } else {
        setError(err.message || "An error occurred during login");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
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
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <AuthForm 
            formType="login"
            onSubmit={handleSubmit}
            onGoogleSignIn={handleGoogleSignIn}
          />
        </div>
      </main>
      
      <Footer />
    </>
  );
}
