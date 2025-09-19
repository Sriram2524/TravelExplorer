import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import WeatherWidget from "@/components/weather-widget";
import MapWidget from "@/components/map-widget";
import { Destination } from "@shared/schema";
import { Link } from "wouter";

export default function DestinationPage() {
  const [match, params] = useRoute("/destination/:id");
  const destinationId = params?.id;

  const { data: destination, isLoading, error } = useQuery<Destination>({
    queryKey: ["/api/destinations", destinationId],
    queryFn: async () => {
      if (!destinationId) throw new Error("No destination ID provided");
      const response = await fetch(`/api/destinations/${destinationId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch destination: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!destinationId,
  });

  if (!match || !destinationId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted h-96 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-muted h-8 rounded mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-2/3 mb-8"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted h-32 rounded"></div>
                  <div className="bg-muted h-32 rounded"></div>
                  <div className="bg-muted h-32 rounded"></div>
                </div>
              </div>
              <div>
                <div className="bg-muted h-48 rounded mb-6"></div>
                <div className="bg-muted h-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading destination</h1>
          <p className="text-muted-foreground mb-8">
            {error instanceof Error ? error.message : "An unknown error occurred"}
          </p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getActivityIcon = (activity: string) => {
    return <MapPin className="text-accent text-xl" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link href="/">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Destinations
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 mb-8">
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          className="w-full h-full object-cover"
          data-testid="img-destination-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white max-w-4xl">
          <h1 className="text-5xl font-bold mb-4" data-testid="text-destination-name">
            {destination.name}
          </h1>
          <p className="text-xl opacity-90" data-testid="text-destination-description">
            {destination.longDescription}
          </p>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center space-x-2">
              <Star className="text-accent h-5 w-5 fill-current" />
              <span className="font-medium text-lg" data-testid="text-rating">
                {destination.rating}
              </span>
              <span className="opacity-80">
                ({destination.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
            <div className="opacity-80">
              {destination.region} • {destination.country}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Photo Gallery */}
            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-6" data-testid="text-gallery-title">
                Photo Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {destination.galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${destination.name} gallery ${index + 1}`}
                    className="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer h-32 object-cover"
                    data-testid={`img-gallery-${index}`}
                  />
                ))}
              </div>
            </div>

            {/* Activities & Highlights */}
            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-6" data-testid="text-activities-title">
                What to Do
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destination.activities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 p-4 bg-card rounded-lg border"
                    data-testid={`activity-${index}`}
                  >
                    {getActivityIcon(activity)}
                    <div>
                      <h3 className="font-semibold text-lg mb-2" data-testid={`text-activity-name-${index}`}>
                        {activity}
                      </h3>
                      <p className="text-muted-foreground">
                        Discover amazing {activity.toLowerCase()} experiences in {destination.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-6">About {destination.name}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {destination.longDescription}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Weather Widget */}
            <div className="mb-6">
              <WeatherWidget
                latitude={destination.latitude}
                longitude={destination.longitude}
                destinationName={destination.name}
              />
            </div>

            {/* Quick Stats */}
            <div className="bg-muted rounded-lg p-6 mb-6" data-testid="quick-stats">
              <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Time to Visit</span>
                  <span className="font-medium" data-testid="text-best-time">
                    {destination.bestTimeToVisit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium" data-testid="text-language">
                    {destination.language}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-medium" data-testid="text-currency">
                    {destination.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Zone</span>
                  <span className="font-medium" data-testid="text-timezone">
                    {destination.timezone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium">
                    {destination.region}
                  </span>
                </div>
              </div>
            </div>

            {/* Map */}
            <MapWidget
              latitude={destination.latitude}
              longitude={destination.longitude}
              destinationName={destination.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
