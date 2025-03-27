import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building, Calendar, PieChart, MessageSquare, Star, Users, Clock, Check, X } from "lucide-react";
import { format } from "date-fns";

export default function ProviderDashboard() {
  const [location, navigate] = useLocation();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      navigate("/login");
    }
    
    // Redirect if user is not a provider
    if (!loading && user && user.userType !== 'provider' && user.userType !== 'both') {
      navigate("/dashboard/user");
    }
  }, [user, loading, navigate]);

  // Fetch user's business profiles
  const { data: businessProfiles, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ['/api/users', user?.id, 'businesses'],
    queryFn: async () => {
      const response = await fetch(`/api/businesses?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch business profiles');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Fetch business bookings
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['/api/businesses', businessProfiles?.[0]?.id, 'bookings'],
    enabled: !!businessProfiles?.[0]?.id
  });

  // Create business profile mutation
  const { mutate: createBusiness, isPending: isCreatingBusiness } = useMutation({
    mutationFn: async (businessData: any) => {
      return apiRequest('POST', '/api/businesses', businessData);
    },
    onSuccess: () => {
      toast({
        title: "Business Profile Created",
        description: "Your business profile has been created successfully.",
      });
      setIsProfileDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'businesses'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create business profile: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update booking status mutation
  const { mutate: updateBookingStatus, isPending: isUpdatingBooking } = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return apiRequest('PATCH', `/api/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Booking Updated",
        description: "The booking status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/businesses', businessProfiles?.[0]?.id, 'bookings'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update booking: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle business profile creation
  const handleCreateBusiness = () => {
    if (!businessName || !businessDescription || !businessCategory || !businessLocation || !contactEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createBusiness({
      userId: user?.id,
      name: businessName,
      description: businessDescription,
      category: businessCategory,
      location: businessLocation,
      contactEmail: contactEmail,
      contactPhone: contactPhone || null,
    });
  };

  // Handle booking response
  const handleBookingResponse = (id: number, status: 'confirmed' | 'cancelled') => {
    updateBookingStatus({ id, status });
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your services and bookings</p>
          </div>

          {isLoadingBusinesses ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : !businessProfiles?.length ? (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="bg-indigo-100 p-6 rounded-full inline-block mb-4">
                    <Building size={32} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Business Profile</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Set up your business profile to showcase your services and start receiving bookings.
                  </p>
                  <Button onClick={() => setIsProfileDialogOpen(true)}>
                    Create Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Business Profile Overview */}
              <Card className="mb-8">
                <CardHeader className="pb-3">
                  <CardTitle>Business Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 h-48 bg-gray-200 rounded-lg"></div>
                    <div className="md:w-3/4">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{businessProfiles[0].name}</h2>
                          <Badge className="mt-1">{businessProfiles[0].category}</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit Profile
                        </Button>
                      </div>
                      <p className="text-gray-600 mb-4">{businessProfiles[0].description}</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users className="mr-1" size={16} />
                          <span>0 clients</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Star className="mr-1" size={16} />
                          <span>No ratings yet</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="mr-1" size={16} />
                          <span>Joined {format(new Date(), 'MMMM yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="bookings" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                {/* Booking Requests Tab */}
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
                            <div className="flex gap-2 mt-4">
                              <Skeleton className="h-10 w-24" />
                              <Skeleton className="h-10 w-24" />
                            </div>
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
                                  Booking Request from User #{booking.customerId}
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
                                onClick={() => setSelectedBookingId(booking.id)}
                              >
                                <MessageSquare size={16} className="mr-1" />
                                Message
                              </Button>
                              
                              {booking.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleBookingResponse(booking.id, 'confirmed')}
                                    disabled={isUpdatingBooking}
                                  >
                                    <Check size={16} className="mr-1" />
                                    Accept
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleBookingResponse(booking.id, 'cancelled')}
                                    disabled={isUpdatingBooking}
                                  >
                                    <X size={16} className="mr-1" />
                                    Decline
                                  </Button>
                                </>
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
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No booking requests yet</h3>
                      <p className="text-gray-600">When clients request your services, they'll appear here</p>
                    </div>
                  )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{bookings?.length || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Confirmed Bookings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {bookings?.filter((booking: any) => booking.status === 'confirmed').length || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Profile Views</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">0</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Booking Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
                        <div className="text-center">
                          <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">Not enough data to display analytics</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
            </>
          )}
        </div>
      </main>

      {/* Create Business Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create Business Profile</DialogTitle>
            <DialogDescription>
              Fill in the details to set up your service provider profile.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name*</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-category">Category*</Label>
              <Select value={businessCategory} onValueChange={setBusinessCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
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
            
            <div className="space-y-2">
              <Label htmlFor="business-location">Location*</Label>
              <Input
                id="business-location"
                value={businessLocation}
                onChange={(e) => setBusinessLocation(e.target.value)}
                placeholder="City, State"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-description">Description*</Label>
              <Textarea
                id="business-description"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe your services..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email*</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBusiness} disabled={isCreatingBusiness}>
              {isCreatingBusiness ? (
                <>
                  <span className="mr-2">Creating...</span>
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                </>
              ) : 'Create Profile'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
