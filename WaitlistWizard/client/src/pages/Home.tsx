import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import WaitlistForm from "@/components/WaitlistForm";
import { ArrowRight, Search, Calendar, Check } from "lucide-react";
import { Link } from "wouter";

// Service category data
const serviceCategories = [
  {
    id: 1,
    title: "Photography",
    subtitle: "Capture your moments",
    image: "https://images.unsplash.com/photo-1516727003284-a96541e51e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: 2,
    title: "Venues",
    subtitle: "Perfect locations",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: 3,
    title: "Catering",
    subtitle: "Delicious experiences",
    image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: 4,
    title: "DJ & Music",
    subtitle: "Set the perfect mood",
    image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: 5,
    title: "Decoration",
    subtitle: "Transform any space",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: 6,
    title: "Lighting",
    subtitle: "Set the atmosphere",
    image: "https://images.unsplash.com/photo-1508219803418-5f1f89764ba4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: 7,
    title: "Event Planning",
    subtitle: "End-to-end coordination",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    id: 8,
    title: "Wedding Services",
    subtitle: "Complete wedding packages",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
  }
];

// Testimonial data
const testimonials = [
  {
    id: 1,
    content: "Planning my daughter's wedding was so much easier with Eventique. We found an amazing photographer and caterer all in one place. Highly recommend!",
    author: "Jennifer M.",
    role: "Mother of the Bride",
    rating: 5
  },
  {
    id: 2,
    content: "As a DJ, I've tried several platforms to find clients. Eventique has by far been the most effective. The booking system is intuitive and I love being able to showcase my portfolio.",
    author: "Robert J.",
    role: "Professional DJ",
    rating: 5
  },
  {
    id: 3,
    content: "When organizing our company retreat, we needed multiple services. Eventique made it easy to compare options, read reviews, and book everything in one place. Saved us hours!",
    author: "Amanda L.",
    role: "Corporate Event Planner",
    rating: 5
  }
];

export default function Home() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-indigo-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Hero Text */}
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                One-stop marketplace for all your <span className="text-indigo-600">event services</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Connect with vetted professionals for photography, catering, venues, decoration, and more. 
                Simplify event planning with Eventique.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="#join-waitlist" className="inline-flex justify-center items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition duration-200">
                  Join Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a href="#for-providers" className="inline-flex justify-center items-center px-6 py-3 bg-white text-indigo-600 border border-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition duration-200">
                  List Your Services
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:w-1/2 relative">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Elegant event setup with decorations and lighting" 
                  className="w-full h-auto"
                />
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs hidden md:block">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-700 font-medium ml-1">4.9/5 from 2,000+ events</span>
                </div>
                <p className="text-sm text-gray-600">Trusted by event planners across the country</p>
              </div>
            </div>
          </div>

          {/* Trusted By */}
          <div className="mt-16 text-center">
            <p className="text-sm uppercase tracking-wide text-gray-500 mb-6">Trusted by event professionals nationwide</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              <div className="text-gray-400 font-heading font-bold text-xl">ACME Events</div>
              <div className="text-gray-400 font-heading font-bold text-xl">Celebration Co.</div>
              <div className="text-gray-400 font-heading font-bold text-xl">Premier Venues</div>
              <div className="text-gray-400 font-heading font-bold text-xl">Elite Catering</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Eventique Works</h2>
            <p className="text-lg text-gray-600">
              We've simplified the process of finding and booking the perfect service providers for your events.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">Discover Services</h3>
              <p className="text-gray-600">
                Browse through our extensive catalog of event services from photographers to caterers, all in one place.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">Book Directly</h3>
              <p className="text-gray-600">
                Choose from available dates and send booking requests directly to service providers through our platform.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">Enjoy Your Event</h3>
              <p className="text-gray-600">
                Communicate securely, manage details, and focus on enjoying your perfectly planned event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Our Services</h2>
            <p className="text-lg text-gray-600">
              Find the perfect professionals to make your event unforgettable
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <ServiceCard 
                key={category.id}
                title={category.title}
                subtitle={category.subtitle}
                imageUrl={category.image}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="#join-waitlist" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-200">
              Sign Up for Early Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Service Providers Section */}
      <section id="for-providers" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Image Side */}
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12">
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Event service professionals in action" 
                    className="w-full h-auto"
                  />
                </div>
                {/* Floating Review Card */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs hidden md:block">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"Since joining Eventique, I've doubled my monthly bookings and expanded my client base."</p>
                  <p className="text-sm font-medium text-gray-800 mt-2">- Sarah, Event Photographer</p>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="lg:w-1/2">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">Grow Your Event Service Business</h2>
              <p className="text-lg text-gray-600 mb-8">
                Join our marketplace and connect with clients looking for your specific services. Eventique offers a streamlined platform to showcase your work, manage bookings, and grow your business.
              </p>

              <div className="space-y-6">
                {/* Benefit 1 */}
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Expand Your Client Base</h3>
                    <p className="mt-1 text-gray-600">
                      Reach new customers actively searching for services like yours.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Save Time on Admin</h3>
                    <p className="mt-1 text-gray-600">
                      Manage bookings, communication, and scheduling through our streamlined platform.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Build Your Reputation</h3>
                    <p className="mt-1 text-gray-600">
                      Collect verified reviews that showcase your quality services to potential clients.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a href="#join-waitlist" className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg shadow-md hover:bg-pink-700 transition duration-200">
                  Join as a Service Provider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">What People Are Saying</h2>
            <p className="text-lg text-gray-600">
              Join the growing community of satisfied users
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                content={testimonial.content}
                author={testimonial.author}
                role={testimonial.role}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="join-waitlist" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col lg:flex-row">
              {/* Form Side */}
              <div className="lg:w-1/2 p-8 lg:p-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Join Our Waitlist</h2>
                <p className="text-white/90 text-lg mb-8">
                  Be the first to know when Eventique launches. Sign up now for early access and exclusive benefits.
                </p>

                <WaitlistForm />
              </div>

              {/* Image Side */}
              <div className="hidden lg:block lg:w-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=1200&q=80" 
                  alt="Happy guests at an event" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="inline-block bg-white/90 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg">
                    <p className="text-gray-800 font-medium">
                      "We're building the future of event services—reimagined for the digital age."
                    </p>
                    <p className="text-gray-600 mt-2">— The Eventique Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
