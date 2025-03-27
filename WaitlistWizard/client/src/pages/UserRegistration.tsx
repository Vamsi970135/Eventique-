import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarCheck, Loader2 } from "lucide-react";

const userRegistrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserRegistrationValues = z.infer<typeof userRegistrationSchema>;

export default function UserRegistration() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserRegistrationValues>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: ""
    },
  });

  const onSubmit = async (values: UserRegistrationValues) => {
    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...userData } = values;
      
      const response = await apiRequest("POST", "/api/register", {
        ...userData,
        userType: "customer"
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Account created successfully!",
          description: "You can now log in to your account.",
        });
        
        // Automatically log the user in
        login(data.data);
        
        // Redirect to customer dashboard
        navigate("/dashboard/customer");
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      let message = "Something went wrong while creating your account.";
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CalendarCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Your Customer Account</h1>
          <p className="text-gray-600">
            Join Eventique to discover and book amazing event services
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Register as a Customer</CardTitle>
            <CardDescription>
              Fill in your details to create an account and start exploring event services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be your unique identifier
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="relative flex items-center justify-center mt-6 mb-4">
              <Separator className="absolute w-full" />
              <div className="bg-white px-4 relative text-sm text-gray-500">or</div>
            </div>
            
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              Sign up with Google
            </Button>
            
            <p className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 text-primary hover:underline"
                onClick={() => navigate("/")}
              >
                Sign in
              </Button>
            </p>
            
            <p className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-sm text-gray-600 hover:text-primary"
                onClick={() => navigate("/register/provider")}
              >
                Want to register as a service provider instead?
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
