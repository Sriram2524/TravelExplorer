import { useQuery } from "@tanstack/react-query";
import { X, Camera, Wine, MapPin, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Destination } from "@shared/schema";
import WeatherWidget from "./weather-widget";
import MapWidget from "./map-widget";

interface DestinationDetailProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DestinationDetail({ destination, isOpen, onClose }: DestinationDetailProps) {
  if (!destination) return null;

  const getActivityIcon = (activity: string) => {
    const lowerActivity = activity.toLowerCase();
    if (lowerActivity.includes("photography") || lowerActivity.includes("camera")) {
      return <Camera className="text-accent text-xl" />;
    }
    if (lowerActivity.includes("wine") || lowerActivity.includes("tasting")) {
      return <Wine className="text-accent text-xl" />;
    }
    if (lowerActivity.includes("cruise") || lowerActivity.includes("ship")) {
      return <Ship className="text-accent text-xl" />;
    }
    return <MapPin className="text-accent text-xl" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl w-full max-h-[90vh] overflow-y-auto p-0"
        data-testid="destination-detail-modal"
      >
        {/* Modal Header */}
        <div className="relative">
          <img 
            src={destination.galleryImages[0] || destination.imageUrl} 
            alt={destination.name}
            className="w-full h-80 object-cover rounded-t-xl"
            data-testid="img-destination-hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-xl"></div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-4xl font-bold mb-2" data-testid="text-destination-name">
              {destination.name}
            </h2>
            <p className="text-lg opacity-90" data-testid="text-destination-description">
              {destination.longDescription}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Photo Gallery */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4" data-testid="text-gallery-title">
                  Photo Gallery
                </h3>
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
                <h3 className="text-2xl font-semibold mb-4" data-testid="text-activities-title">
                  What to Do
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.activities.map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-3"
                      data-testid={`activity-${index}`}
                    >
                      {getActivityIcon(activity)}
                      <div>
                        <h4 className="font-semibold" data-testid={`text-activity-name-${index}`}>
                          {activity}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Discover amazing {activity.toLowerCase()} experiences
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
                <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
                <div className="space-y-3">
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
      </DialogContent>
    </Dialog>
  );
}
