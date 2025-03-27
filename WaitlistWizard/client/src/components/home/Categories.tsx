import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  providerCount: number;
}

export default function Categories() {
  const { data: categoriesData, isLoading } = useQuery<{ success: boolean, data: Category[] }>({
    queryKey: ['/api/categories'],
    retry: false
  });

  const categories = categoriesData?.data || [];

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Service Categories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find everything you need for your perfect event in one place.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="rounded-xl overflow-hidden">
                <Skeleton className="w-full h-56" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <div key={category.id} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <img 
                  src={category.image} 
                  alt={`${category.name} Services`} 
                  className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white w-full">
                    <div className="text-lg font-bold">{category.name}</div>
                    <div className="flex justify-between items-center">
                      <span>{category.providerCount}+ Providers</span>
                      <ArrowRight className="opacity-0 group-hover:opacity-100 transition" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Button variant="outline" className="group">
            Explore All Categories <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
