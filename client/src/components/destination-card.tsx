import { Star, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Destination } from "@shared/schema";
import { useLocation } from "wouter";

interface DestinationCardProps {
  destination: Destination;
  onViewDetails: (destination: Destination) => void;
}

export default function DestinationCard({ destination, onViewDetails }: DestinationCardProps) {
  const [, setLocation] = useLocation();

  const handleViewDetails = () => {
    setLocation(`/destination/${destination.id}`);
  };

  return (
    <Card 
      className="destination-card bg-card rounded-lg shadow-lg overflow-hidden cursor-pointer"
      data-testid={`card-destination-${destination.id}`}
    >
      <div className="relative h-64">
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          className="w-full h-full object-cover"
          data-testid={`img-destination-${destination.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-semibold" data-testid={`text-name-${destination.id}`}>
            {destination.name}
          </h3>
          <p className="text-sm opacity-90" data-testid={`text-region-${destination.id}`}>
            {destination.region}
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            data-testid={`button-favorite-${destination.id}`}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4" data-testid={`text-description-${destination.id}`}>
          {destination.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="text-accent h-4 w-4 fill-current" />
            <span className="font-medium" data-testid={`text-rating-${destination.id}`}>
              {destination.rating}
            </span>
            <span className="text-muted-foreground text-sm">
              (<span data-testid={`text-reviews-${destination.id}`}>{destination.reviewCount.toLocaleString()}</span> reviews)
            </span>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 font-medium p-0"
            onClick={handleViewDetails}
            data-testid={`button-view-details-${destination.id}`}
          >
            View Details <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
