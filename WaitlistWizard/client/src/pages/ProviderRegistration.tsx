import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CalendarCheck, Loader2 } from "lucide-react";

// Define step specific schemas
const userDetailsSchema = z.object({
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

const businessDetailsSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  description: z.string().min(10, "Please provide a more detailed description"),
  categoryId: z.string().min(1, "Please select a category"),
  location: z.string().min(2, "Location is required"),
  startingPrice: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "Starting price must be a number",
  }),
});

type UserDetailsValues = z.infer<typeof userDetailsSchema>;
type BusinessDetailsValues = z.infer<typeof businessDetailsSchema>;

interface Category {
  id: number;
  name: string;
}

export default function ProviderRegistration() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [step, setStep] = useState<'user' | 'business'>('user');
  const [userData, setUserData] = useState<UserDetailsValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery<{ success: boolean, data: Category[] }>({
    queryKey: ['/api/categories'],
    retry: false
  });

  const categories = categoriesData?.data || [];

  const userForm = useForm<UserDetailsValues>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: ""
    },
  });

  const businessForm = useForm<BusinessDetailsValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      businessName: "",
      description: "",
      categoryId: "",
      location: "",
      startingPrice: ""
    },
  });

  const handleUserDetailsSubmit = (values: UserDetailsValues) => {
    setUserData(values);
    setStep('business');
  };

  const handleBusinessDetailsSubmit = async (values: BusinessDetailsValues) => {
    if (!userData) return;
    
    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...userRegistrationData } = userData;
      
      // First register the user
      const userResponse = await apiRequest("POST", "/api/register", {
        ...userRegistrationData,
        userType: "provider"
      });
      
      const userData2 = await userResponse.json();
      
      if (!userData2.success) {
        throw new Error(userData2.error || "Failed to create user account");
      }
      
      // Then register the business
      const businessResponse = await apiRequest("POST", "/api/providers", {
        userId: userData2.data.id,
        businessName: values.businessName,
        description: values.description,
        categoryId: parseInt(values.categoryId),
        location: values.location,
        startingPrice: parseInt(values.startingPrice),
        portfolioImages: []  // Start with empty portfolio
      });
      
      const businessData = await businessResponse.json();
      
      if (!businessData.success) {
        throw new Error(businessData.error || "Failed to create business profile");
      }
      
      toast({
        title: "Registration successful!",
        description: "Your service provider account has been created.",
      });
      
      // Log the user in
      login(userData2.data);
      
      // Redirect to provider dashboard
      navigate("/dashboard/provider");
      
    } catch (error) {
      let message = "Something went wrong during registration.";
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: "Registration failed",
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
          <h1 className="text-3xl font-bold mb-2">Become a Service Provider</h1>
          <p className="text-gray-600">
            Join Eventique to offer your services to customers planning events
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'user' ? 'Step 1: Create Your Account' : 'Step 2: Business Details'}
            </CardTitle>
            <CardDescription>
              {step === 'user' 
                ? 'First, let\'s set up your personal account' 
                : 'Now, tell us about your business and services'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'user' ? (
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(handleUserDetailsSubmit)} className="space-y-6">
                  <FormField
                    control={userForm.control}
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
                      control={userForm.control}
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
                      control={userForm.control}
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
                    control={userForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 123 456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={userForm.control}
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
                      control={userForm.control}
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
                  
                  <Button type="submit" className="w-full">
                    Continue to Business Details
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...businessForm}>
                <form onSubmit={businessForm.handleSubmit(handleBusinessDetailsSubmit)} className="space-y-6">
                  <FormField
                    control={businessForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Awesome Events LLC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={businessForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell customers about your services, experience, and what makes you special..." 
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={businessForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isCategoriesLoading ? (
                              <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                            ) : categories.length === 0 ? (
                              <SelectItem value="none" disabled>No categories available</SelectItem>
                            ) : (
                              categories.map(category => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                  {category.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={businessForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={businessForm.control}
                    name="startingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="299" {...field} />
                        </FormControl>
                        <FormDescription>
                          The minimum price for your services
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setStep('user')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            
            {step === 'user' && (
              <>
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
                    onClick={() => navigate("/register/user")}
                  >
                    Want to register as a customer instead?
                  </Button>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
