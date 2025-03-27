import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
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
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar, 
  MessageSquare, 
  Clock, 
  Check, 
  X as XIcon
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
}

interface Booking {
  id: number;
  customerId: number;
  providerId: number;
  status: string;
  eventDate: string;
  eventDetails: string;
}

export default function CustomerDashboard() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.userType !== "customer") {
      navigate("/dashboard/provider");
    }
  }, [user, navigate]);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery<{ success: boolean, data: Category[] }>({
    queryKey: ['/api/categories'],
    retry: false
  });

  const { data: providersData, isLoading: isProvidersLoading } = useQuery<{ success: boolean, data: ServiceProvider[] }>({
    queryKey: ['/api/providers'],
    retry: false
  });

  const { data: bookingsData, isLoading: isBookingsLoading } = useQuery<{ success: boolean, data: Booking[] }>({
    queryKey: user ? [`/api/bookings/customer/${user.id}`] : null,
    retry: false,
    enabled: !!user
  });

  const categories = categoriesData?.data || [];
  const allProviders = providersData?.data || [];
  const bookings = bookingsData?.data || [];

  const filteredProviders = allProviders.filter((provider) => {
    const matchesSearch = provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          provider.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? provider.categoryId === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "accepted": return <Check className="h-4 w-4" />;
      case "rejected": return <XIcon className="h-4 w-4" />;
      case "completed": return <Check className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.fullName}</p>
      </div>

      <Tabs defaultValue="browse">
        <TabsList className="mb-6">
          <TabsTrigger value="browse">Browse Services</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search for service providers..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter size={18} />
                Filter
              </Button>
              <select 
                className="p-2 border rounded-md"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          {isProvidersLoading || isCategoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No service providers found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => {
                const category = categories.find(c => c.id === provider.categoryId);
                return (
                  <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={provider.portfolioImages?.[0] || "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                        alt={provider.businessName} 
                        className="w-full h-full object-cover"
                      />
                      {category && (
                        <Badge className="absolute top-3 right-3 bg-white text-primary">
                          {category.name}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{provider.businessName}</h3>
                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-yellow-400 h-4 w-4" />
                          <span className="ml-1 font-medium">{provider.rating || "New"}</span>
                          {provider.reviewCount > 0 && (
                            <span className="text-gray-500 text-sm ml-1">({provider.reviewCount})</span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{provider.description}</p>
                      <div className="flex items-center text-gray-500 mb-5">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span className="text-sm">{provider.location}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => navigate(`/providers/${provider.id}`)}
                      >
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings">
          {isBookingsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Skeleton className="h-32 w-32 rounded-md" />
                      <div className="flex-grow space-y-2">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                        <div className="flex gap-2 mt-4">
                          <Skeleton className="h-9 w-20" />
                          <Skeleton className="h-9 w-20" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any bookings with service providers yet.</p>
              <Button onClick={() => document.querySelector('[data-value="browse"]')?.click()}>
                Browse Service Providers
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const provider = allProviders.find(p => p.id === booking.providerId);
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {provider && (
                          <div className="h-32 w-32 rounded-md overflow-hidden">
                            <img 
                              src={provider.portfolioImages?.[0] || "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                              alt={provider.businessName} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{provider?.businessName || "Service Provider"}</h3>
                            <Badge className={`flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="capitalize">{booking.status}</span>
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">
                            <Calendar className="inline h-4 w-4 mr-1" /> 
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 mb-4">{booking.eventDetails}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              Message
                            </Button>
                            {booking.status === "completed" && (
                              <Button size="sm" className="gap-1">
                                <Star className="h-4 w-4" />
                                Leave Review
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages">
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h3>
            <p className="text-gray-600">
              When you message service providers, your conversations will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
