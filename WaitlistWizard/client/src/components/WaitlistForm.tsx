import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  userType: z.string().min(1, { message: "Please select an option" }),
  receivesUpdates: z.boolean().default(true)
});

export default function WaitlistForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      userType: "",
      receivesUpdates: true
    }
  });

  // API mutation for submitting waitlist form
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/waitlist", values);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
      });
      setSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  // If form is submitted successfully, show success message
  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="bg-white/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mt-4">You're on the list!</h3>
        <p className="text-white/90 mt-2">Thanks for joining our waitlist. We'll notify you when Eventique launches.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your full name" 
                  {...field} 
                  className="bg-white/10 text-white placeholder-white/60 border-white/20 focus:ring-white/50"
                />
              </FormControl>
              <FormMessage className="text-white/90" />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  {...field} 
                  className="bg-white/10 text-white placeholder-white/60 border-white/20 focus:ring-white/50"
                />
              </FormControl>
              <FormMessage className="text-white/90" />
            </FormItem>
          )}
        />

        {/* User Type Field */}
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">I am a...</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white/10 text-white border-white/20 focus:ring-white/50">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="customer">Customer looking for event services</SelectItem>
                  <SelectItem value="provider">Service provider wanting to list my business</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-white/90" />
            </FormItem>
          )}
        />

        {/* Receives Updates Field */}
        <FormField
          control={form.control}
          name="receivesUpdates"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-white data-[state=checked]:text-indigo-600"
                />
              </FormControl>
              <FormLabel className="text-sm font-normal text-white">
                I agree to receive updates about Eventique
              </FormLabel>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition duration-200"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="mr-2">Joining...</span>
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-indigo-600 animate-spin"></div>
            </>
          ) : 'Join Waitlist'}
        </Button>
      </form>

      <p className="text-white/70 text-sm mt-4">
        We respect your privacy and will never share your information with third parties.
      </p>
    </Form>
  );
}
