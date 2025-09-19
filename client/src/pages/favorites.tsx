import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import DestinationCard from "@/components/destination-card";
import DestinationDetail from "@/components/destination-detail";
import { Heart } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Destination } from "@shared/schema";
import { useFavorites } from "@/hooks/use-favorites";

export default function Favorites() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { favorites: favoriteIds } = useFavorites();

  // Fetch all destinations and filter by favorites
  const { data: allDestinations = [], isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
    queryFn: async () => {
      const response = await fetch("/api/destinations");
      if (!response.ok) {
        throw new Error("Failed to fetch destinations");
      }
      return response.json();
    },
  });

  // Filter destinations to only include favorites
  const favorites = useMemo(() => {
    return allDestinations.filter(destination => favoriteIds.includes(destination.id));
  }, [allDestinations, favoriteIds]);

  const handleViewDetails = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section for Favorites */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <Heart className="text-primary text-6xl mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-foreground mb-6 animate-gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Your Favorite Destinations
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Keep track of all the amazing places you want to visit. Your personal travel wishlist awaits!
            </p>
          </div>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-enhanced rounded-2xl overflow-hidden shadow-lg animate-bounce-gentle" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className="skeleton-enhanced h-64 mb-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                  <div className="p-6">
                    <div className="skeleton-enhanced rounded-lg h-6 mb-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                    <div className="skeleton-enhanced rounded-lg h-4 w-2/3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-20" data-testid="no-favorites">
              <Heart className="text-muted-foreground text-8xl mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">No favorites yet</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Start exploring destinations and add them to your favorites to see them here.
              </p>
              <Link
                href="/#destinations-section"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                data-testid="link-explore-destinations"
              >
                Explore Destinations
              </Link>
            </div>
          ) : (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {favorites.length} Saved Destination{favorites.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your handpicked collection of dream destinations
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                {favorites.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Destination Detail Modal */}
      <DestinationDetail
        destination={selectedDestination}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}