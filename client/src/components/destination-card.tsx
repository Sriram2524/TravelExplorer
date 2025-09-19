import { Star, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Destination } from "@shared/schema";
import { useLocation } from "wouter";
import { useFavorites } from "@/hooks/use-favorites";
import MiniWeather from "@/components/mini-weather";

interface DestinationCardProps {
  destination: Destination;
  onViewDetails: (destination: Destination) => void;
}

export default function DestinationCard({ destination, onViewDetails }: DestinationCardProps) {
  const [, setLocation] = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleViewDetails = () => {
    setLocation(`/destination/${destination.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite button
    toggleFavorite(destination.id);
  };

  return (
    <Card 
      className="destination-card bg-card rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-1 group border-0"
      data-testid={`card-destination-${destination.id}`}
      onClick={handleViewDetails}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          data-testid={`img-destination-${destination.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity duration-500 group-hover:from-black/70"></div>
        <div className="absolute bottom-4 left-4 text-white transform transition-transform duration-500 group-hover:translate-y-[-4px]">
          <h3 className="text-xl font-semibold drop-shadow-lg" data-testid={`text-name-${destination.id}`}>
            {destination.name}
          </h3>
          <p className="text-sm opacity-90 drop-shadow-md" data-testid={`text-region-${destination.id}`}>
            {destination.region}
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className={`backdrop-blur-sm p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 group-hover:animate-bounce ${
              isFavorite(destination.id) 
                ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
                : 'bg-white/20 text-white hover:bg-red-500/80 hover:text-white'
            }`}
            onClick={handleFavoriteClick}
            data-testid={`button-favorite-${destination.id}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite(destination.id) ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <MiniWeather 
          latitude={destination.latitude}
          longitude={destination.longitude}
          destinationId={destination.id}
        />
      </div>
      
      <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
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
            className="text-primary hover:text-primary/80 font-medium p-0 group/btn transition-all duration-300 hover:bg-primary/10 px-3 py-2 rounded-lg"
            onClick={handleViewDetails}
            data-testid={`button-view-details-${destination.id}`}
          >
            View Details <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
