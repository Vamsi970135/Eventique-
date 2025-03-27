import { useState } from "react";
import { Button } from "@/components/ui/button";
import WaitlistModal from "@/components/ui/WaitlistModal";
import { useQuery } from "@tanstack/react-query";

export default function Hero() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  
  // Fetch waitlist count
  const { data: waitlistData } = useQuery({
    queryKey: ['/api/waitlist/count'],
    retry: false,
    refetchOnWindowFocus: false
  });
  
  const waitlistCount = waitlistData?.data?.count || 500;

  return (
    <>
      <section className="bg-gradient-to-r from-indigo-500/10 to-pink-500/10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find the Perfect Event Services
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with top-rated event professionals for your special occasions. From venues to catering, photography to decoration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setIsWaitlistModalOpen(true)}
                >
                  Join the Waitlist
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setIsProviderModalOpen(true)}
                >
                  Become a Service Provider
                </Button>
              </div>
              <div className="mt-8 flex items-center text-gray-500">
                <div className="flex -space-x-2 mr-4">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-400" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-400" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-violet-400" />
                </div>
                <span>Join <span className="font-medium text-primary">{waitlistCount}+</span> people on the waitlist</span>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Event venue with elegant decoration" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="font-medium">Featured Venue</div>
                    <div className="text-lg font-bold">The Grand Pavilion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <WaitlistModal 
        isOpen={isWaitlistModalOpen} 
        onClose={() => setIsWaitlistModalOpen(false)} 
        userType="customer"
      />
      
      <WaitlistModal 
        isOpen={isProviderModalOpen} 
        onClose={() => setIsProviderModalOpen(false)} 
        userType="provider"
      />
    </>
  );
}
