import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

export default function ServiceCard({ title, subtitle, imageUrl }: ServiceCardProps) {
  return (
    <div className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <img 
        src={imageUrl} 
        alt={`${title} services for events`} 
        className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-heading font-semibold text-lg">{title}</h3>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
