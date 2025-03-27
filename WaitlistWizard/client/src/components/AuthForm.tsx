import { useState } from "react";
import { Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers and underscores" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  formType: "login" | "register";
  onSubmit: (email: string, password: string, fullName?: string, username?: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  isProvider?: boolean;
}

export default function AuthForm({ formType, onSubmit, onGoogleSignIn, isProvider = false }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: ""
    }
  });

  // Handle login form submission
  const handleLoginSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values.email, values.password);
    } catch (error) {
      console.error("Login submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle register form submission
  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values.email, values.password, values.fullName, values.username);
    } catch (error) {
      console.error("Register submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await onGoogleSignIn();
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Login Form */}
        {formType === "login" && (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Logging in...</span>
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin"></div>
                  </>
                ) : 'Log In'}
              </Button>
            </form>
          </Form>
        )}

        {/* Register Form */}
        {formType === "register" && (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Creating account...</span>
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin"></div>
                  </>
                ) : isProvider ? 'Register as Provider' : 'Create Account'}
              </Button>
            </form>
          </Form>
        )}

        <div className="relative my-6">
          <Separator />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
            OR
          </span>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Form toggle links */}
        <div className="mt-6 text-center text-sm">
          {formType === "login" ? (
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Log in
              </Link>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
