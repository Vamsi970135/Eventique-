import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Search, Filter, MapPin, Star, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";

export default function UserDashboard() {
  const [location, navigate] = useLocation();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Fetch businesses
  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ['/api/businesses', selectedCategory],
    enabled: !!user
  });

  // Fetch user bookings
  const { data: bookings, isLoading: isLoadingBookings, refetch: refetchBookings } = useQuery({
    queryKey: ['/api/users', user?.id, 'bookings'],
    enabled: !!user?.id
  });

  // Create booking mutation
  const { mutate: createBooking, isPending: isCreatingBooking } = useMutation({
    mutationFn: async (bookingData: any) => {
      return apiRequest('POST', '/api/bookings', bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Requested",
        description: "Your booking request has been sent to the service provider.",
      });
      setBookingDialogOpen(false);
      setBookingDetails("");
      setSelectedDate(undefined);
      refetchBookings();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create booking: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Send message mutation
  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: async (messageData: any) => {
      return apiRequest('POST', '/api/messages', messageData);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the service provider.",
      });
      setMessageContent("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle booking submission
  const handleBookingSubmit = () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select an event date",
        variant: "destructive",
      });
      return;
    }

    createBooking({
      customerId: user?.id,
      businessId: selectedBusiness?.id,
      eventDate: selectedDate,
      status: "pending",
      details: bookingDetails
    });
  };

  // Handle message submission
  const handleSendMessage = (receiverId: number) => {
    if (!messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    sendMessage({
      senderId: user?.id,
      receiverId: receiverId,
      bookingId: selectedBookingId,
      content: messageContent
    });
  };

  // Filter businesses based on search query
  const filteredBusinesses = businesses?.filter((business: any) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory && selectedCategory !== "all" ? business.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName}</h1>
            <p className="text-gray-600 mt-2">Find and manage your event services in one place</p>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList>
              <TabsTrigger value="browse">Browse Services</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            {/* Browse Services Tab */}
            <TabsContent value="browse" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search input */}
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search for services..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Category filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Venue">Venues</SelectItem>
                    <SelectItem value="Catering">Catering</SelectItem>
                    <SelectItem value="DJ">DJ & Music</SelectItem>
                    <SelectItem value="Decoration">Decoration</SelectItem>
                    <SelectItem value="Lighting">Lighting</SelectItem>
                    <SelectItem value="Planning">Event Planning</SelectItem>
                    <SelectItem value="Wedding">Wedding Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoadingBusinesses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredBusinesses?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map((business: any) => (
                    <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-gray-200 relative">
                        {/* This would be the business image */}
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-white text-indigo-600 hover:bg-gray-100">
                            {business.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              <MapPin size={14} className="mr-1" />
                              <span>{business.location}</span>
                            </div>
                          </div>
                          {business.rating && (
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700">
                              <Star size={14} className="mr-1 fill-yellow-500 text-yellow-500" />
                              <span className="font-medium">{business.rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{business.description}</p>
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedBusiness(business);
                              setBookingDialogOpen(true);
                            }}
                          >
                            Book Now
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            // This would open a detailed view
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-6 rounded-lg inline-block mb-4">
                    <Search size={32} className="text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No services found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for</p>
                </div>
              )}
            </TabsContent>

            {/* My Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              {isLoadingBookings ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                        <Skeleton className="h-4 w-full mt-3" />
                        <Skeleton className="h-10 w-20 mt-4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : bookings?.length ? (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {/* This would be filled with the business name */}
                              Booking with Business #{booking.businessId}
                            </h3>
                            <div className="flex items-center text-gray-500 mt-1">
                              <CalendarIcon size={16} className="mr-1" />
                              <span>{format(new Date(booking.eventDate), 'PPP')}</span>
                            </div>
                          </div>
                          <Badge 
                            className={`
                              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                'bg-blue-100 text-blue-800 hover:bg-blue-100'}
                            `}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        
                        {booking.details && (
                          <p className="text-gray-600 mb-4 text-sm">{booking.details}</p>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedBookingId(booking.id);
                              // This would open a messaging dialog
                            }}
                          >
                            <MessageSquare size={16} className="mr-1" />
                            Message
                          </Button>
                          
                          {booking.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              // This would cancel the booking
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-6 rounded-lg inline-block mb-4">
                    <Calendar size={32} className="text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings yet</h3>
                  <p className="text-gray-600 mb-4">When you book services, they'll appear here</p>
                  <Button onClick={() => document.querySelector('[data-value="browse"]')?.click()}>
                    Browse Services
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <div className="text-center py-12">
                <div className="bg-gray-100 p-6 rounded-lg inline-block mb-4">
                  <MessageSquare size={32} className="text-gray-400 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Coming Soon</h3>
                <p className="text-gray-600">The messaging system will be available in the next update</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book {selectedBusiness?.name}</DialogTitle>
            <DialogDescription>
              Create a booking request for this service provider.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Event Date</Label>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Booking Details</Label>
              <Textarea
                id="details"
                placeholder="Describe your event and requirements..."
                value={bookingDetails}
                onChange={(e) => setBookingDetails(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookingSubmit} disabled={isCreatingBooking}>
              {isCreatingBooking ? (
                <>
                  <span className="mr-2">Sending...</span>
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                </>
              ) : 'Send Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
