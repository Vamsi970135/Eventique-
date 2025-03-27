import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star } from "lucide-react";

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

export default function FeaturedProviders() {
  const { data: providersData, isLoading: isProvidersLoading } = useQuery<{ success: boolean, data: ServiceProvider[] }>({
    queryKey: ['/api/providers'],
    retry: false
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery<{ success: boolean, data: Category[] }>({
    queryKey: ['/api/categories'],
    retry: false
  });

  const providers = providersData?.data || [];
  const categories = categoriesData?.data || [];
  const isLoading = isProvidersLoading || isCategoriesLoading;

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "";
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Service Providers</h2>
            <p className="text-gray-600">
              Top-rated professionals ready to make your event special
            </p>
          </div>
          <div className="hidden md:block">
            <Button variant="outline">
              View All
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <Skeleton className="h-52 rounded-t-lg" />
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-2/3 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/3 mb-5" />
                  <div className="border-t pt-4 flex justify-between items-center">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {providers.slice(0, 3).map((provider) => (
              <Card key={provider.id} className="overflow-hidden group hover:shadow-lg transition">
                <div className="relative">
                  <img 
                    src={provider.portfolioImages?.[0] || "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                    alt={provider.businessName} 
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-primary">
                    {getCategoryName(provider.categoryId)}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition">{provider.businessName}</h3>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-yellow-400 h-4 w-4" />
                      <span className="ml-1 font-medium">{provider.rating || 0}</span>
                      <span className="text-gray-500 text-sm ml-1">({provider.reviewCount || 0})</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {provider.description}
                  </p>
                  <div className="flex items-center text-gray-500 mb-5">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{provider.location}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-primary font-medium">Starting at ${provider.startingPrice}</span>
                    <Link href={`/providers/${provider.id}`}>
                      <Button variant="secondary" className="bg-primary/10">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline">
            View All Providers
          </Button>
        </div>
      </div>
    </section>
  );
}
