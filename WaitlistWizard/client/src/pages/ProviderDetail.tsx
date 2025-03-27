import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CalendarIcon, 
  Check, 
  Clock, 
  Loader2, 
  MapPin, 
  MessageCircle, 
  Phone, 
  Share2, 
  Star, 
  User 
} from "lucide-react";

interface ServiceProvider {
  id: number;
  userId: number;
  businessName: string;
  description: string;
  categoryId: number;
  location: string;
  startingPrice: number;
  portfolioImages: string[];
  rating: number;
  reviewCount: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Review {
  id: number;
  customerId: number;
  providerId: number;
  bookingId?: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

const bookingSchema = z.object({
  eventDate: z.string().min(1, "Event date is required"),
  eventDetails: z.string().min(10, "Please provide more details about your event")
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function ProviderDetail() {
  const [, params] = useRoute("/providers/:id");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const providerId = params?.id ? parseInt(params.id) : null;

  const { data: providerData, isLoading: isProviderLoading } = useQuery<{ success: boolean, data: ServiceProvider }>({
    queryKey: providerId ? [`/api/providers/${providerId}`] : null,
    retry: false,
    enabled: !!providerId
  });

  const { data: categoryData, isLoading: isCategoryLoading } = useQuery<{ success: boolean, data: Category }>({
    queryKey: providerData?.data?.categoryId ? [`/api/categories/${providerData.data.categoryId}`] : null,
    retry: false,
    enabled: !!providerData?.data?.categoryId
  });

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery<{ success: boolean, data: Review[] }>({
    queryKey: providerId ? [`/api/reviews/provider/${providerId}`] : null,
    retry: false,
    enabled: !!providerId
  });

  const provider = providerData?.data;
  const category = categoryData?.data;
  const reviews = reviewsData?.data || [];

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventDate: "",
      eventDetails: ""
    },
  });

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in or create an account to book services.",
        variant: "destructive",
      });
      return;
    }

    if (user.userType !== "customer") {
      toast({
        title: "Not Allowed",
        description: "Service providers cannot book other providers. Please use a customer account.",
        variant: "destructive",
      });
      return;
    }

    setIsBookingModalOpen(true);
  };

  const onSubmitBooking = async (values: BookingFormValues) => {
    if (!user || !provider) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/bookings", {
        customerId: user.id,
        providerId: provider.id,
        eventDate: new Date(values.eventDate).toISOString(),
        eventDetails: values.eventDetails
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Booking Requested",
          description: "Your booking request has been sent to the service provider.",
        });
        setIsBookingModalOpen(false);
        form.reset();
      } else {
        throw new Error(data.error || "Failed to create booking");
      }
    } catch (error) {
      let message = "Something went wrong while creating your booking.";
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: "Booking Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // For demo purposes, get random customer names for reviews
  const getCustomerName = (customerId: number) => {
    const names = ["Alex Johnson", "Sam Taylor", "Jamie Smith", "Morgan Lee", "Casey Brown"];
    return names[customerId % names.length];
  };

  if (!providerId) {
    return <div>Invalid provider ID</div>;
  }

  const isLoading = isProviderLoading || isCategoryLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3 space-y-4">
              <Skeleton className="h-80 w-full rounded-lg" />
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded" />
                ))}
              </div>
            </div>
            
            <div className="md:w-1/3 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      ) : provider ? (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="rounded-lg overflow-hidden aspect-video mb-4">
                <img 
                  src={provider.portfolioImages?.[0] || "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                  alt={provider.businessName} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {provider.portfolioImages?.slice(1)?.map((image, index) => (
                  <div key={index} className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={image} 
                      alt={`${provider.businessName} portfolio ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {(!provider.portfolioImages || provider.portfolioImages.length <= 1) && (
                  <>
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-200"></div>
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-200"></div>
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-200"></div>
                  </>
                )}
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="sticky top-24">
                <h1 className="text-3xl font-bold mb-2">{provider.businessName}</h1>
                
                <div className="flex items-center gap-2 mb-2">
                  {category && (
                    <Badge>{category.name}</Badge>
                  )}
                  <div className="flex items-center text-yellow-500">
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <span className="ml-1 font-medium">{provider.rating || "New"}</span>
                    {provider.reviewCount > 0 && (
                      <span className="text-gray-500 text-sm ml-1">({provider.reviewCount} reviews)</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{provider.location}</span>
                </div>
                
                <p className="text-gray-700 mb-4">{provider.description}</p>
                
                <div className="text-xl font-semibold text-primary mb-4">
                  Starting at ${provider.startingPrice}
                </div>
                
                <Button 
                  className="w-full mb-2"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" className="flex-1 gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({provider.reviewCount || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About {provider.businessName}</h3>
                  <p className="text-gray-700">{provider.description}</p>
                  
                  <h4 className="font-semibold mt-6 mb-2">Services Offered</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Professional {category?.name || "Event"} Services</li>
                    <li>Customer Consultation</li>
                    <li>Customized Packages</li>
                    <li>24/7 Support</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{provider.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">Contact via platform</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Response Time</p>
                        <p className="font-medium">Usually within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              {isReviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-6">
                    This service provider hasn't received any reviews yet. Be the first to leave a review after your booking!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{getCustomerName(review.customerId)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h2>
          <p className="text-gray-600 mb-8">The service provider you are looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      )}

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              Request to book {provider?.businessName} for your event.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitBooking)} className="space-y-4">
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input 
                          type="date" 
                          {...field}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your event, requirements, number of guests, etc." 
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setIsBookingModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Request Booking'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
