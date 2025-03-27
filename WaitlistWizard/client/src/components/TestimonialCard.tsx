import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  rating: number;
}

export default function TestimonialCard({ content, author, role, rating }: TestimonialCardProps) {
  return (
    <Card className="bg-white rounded-xl p-8 shadow-lg">
      <CardContent className="p-0">
        <div className="flex text-yellow-500 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-5 w-5 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'fill-gray-200 text-gray-200'}`} 
            />
          ))}
        </div>
        <p className="text-gray-600 italic mb-6">
          "{content}"
        </p>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
            {author.split(' ').map(name => name[0]).join('')}
          </div>
          <div className="ml-3">
            <h4 className="font-medium text-gray-900">{author}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
