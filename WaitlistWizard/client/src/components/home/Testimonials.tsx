import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah J.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      role: "Wedding Planner",
      rating: 5,
      quote: "Eventique transformed how I find vendors for my clients. The quality of professionals on the platform is outstanding, and the booking process is seamless."
    },
    {
      name: "Michael T.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      role: "Corporate Event Manager",
      rating: 4.5,
      quote: "As someone who organizes multiple corporate events yearly, Eventique has saved me countless hours of searching and negotiating with vendors."
    },
    {
      name: "Priya K.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      role: "Photographer",
      rating: 5,
      quote: "As a service provider, Eventique has helped me grow my photography business by connecting me with clients who appreciate quality work."
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="text-gray-300" size={18} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="fill-yellow-400 text-yellow-400" size={18} />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={18} />);
    }

    return stars;
  };

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What People Are Saying</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from people who have used Eventique to find the perfect event services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-5">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
              <div className="mb-4 flex">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
