import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface MapWidgetProps {
  latitude: number;
  longitude: number;
  destinationName: string;
}

export default function MapWidget({ latitude, longitude, destinationName }: MapWidgetProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (typeof window === "undefined" || !mapRef.current) return;

      try {
        const L = await import("leaflet");
        
        // Import Leaflet CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        // Clean up existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Create map
        const map = L.map(mapRef.current).setView([latitude, longitude], 10);

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add marker
        const customIcon = L.divIcon({
          html: `<div style="background-color: hsl(200 98% 49%); color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          className: "custom-map-marker"
        });

        L.marker([latitude, longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup(destinationName);

        mapInstanceRef.current = map;

        // Disable scroll zoom initially
        map.scrollWheelZoom.disable();
        
        // Enable scroll zoom on click
        map.on("click", () => {
          map.scrollWheelZoom.enable();
        });
        
        // Disable scroll zoom when mouse leaves
        map.on("mouseout", () => {
          map.scrollWheelZoom.disable();
        });

      } catch (error) {
        console.error("Failed to load map:", error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, destinationName]);

  return (
    <div className="bg-muted rounded-lg p-6" data-testid="map-widget">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <MapPin className="mr-2 h-5 w-5" />
        Location
      </h3>
      <div 
        ref={mapRef}
        className="bg-white rounded-lg h-48"
        data-testid="map-container"
        style={{ minHeight: "200px" }}
      >
        {/* Fallback content while map loads */}
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p>Loading map...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
