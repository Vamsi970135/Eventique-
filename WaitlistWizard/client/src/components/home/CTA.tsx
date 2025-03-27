import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

export default function CTA() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: WaitlistFormValues) => {
      const data = {
        email: values.email,
        fullName: "Guest User",  // Using a default name for simplicity on quick sign up
        userType: "customer",
        newsletter: true,
      };
      return apiRequest("POST", "/api/waitlist", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you when we launch!",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join the waitlist. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: WaitlistFormValues) => {
    setIsSubmitting(true);
    mutation.mutate(values);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent">
      <div className="container mx-auto px-4">
        <div className="text-center text-white max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Event Planning?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join our waitlist today and be the first to experience the future of event service marketplace.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-2 rounded-lg max-w-xl mx-auto flex flex-col md:flex-row">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow md:mr-2 mb-2 md:mb-0">
                    <FormControl>
                      <Input 
                        placeholder="Enter your email address" 
                        className="px-4 py-3 rounded-md focus:outline-none text-gray-800 border-0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-left text-red-200 text-sm mt-1" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
          </Form>
          
          <p className="mt-4 text-sm opacity-80">
            By joining, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
