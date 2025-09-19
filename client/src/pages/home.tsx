import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FilterSection from "@/components/filter-section";
import DestinationCard from "@/components/destination-card";
import DestinationDetail from "@/components/destination-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Users, ExternalLink } from "lucide-react";
import { Destination } from "@shared/schema";
import { FilterState } from "@/types/destination";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterState>({
    region: null,
    tag: null,
    search: ""
  });
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Build query params based on active filters
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (activeFilter.region) params.append("region", activeFilter.region);
    if (activeFilter.tag) params.append("tag", activeFilter.tag);
    if (activeFilter.search) params.append("search", activeFilter.search);
    return params.toString();
  };

  const { data: destinations = [], isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", activeFilter],
    queryFn: async () => {
      const queryParams = buildQueryParams();
      const url = queryParams ? `/api/destinations?${queryParams}` : "/api/destinations";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch destinations");
      }
      return response.json();
    },
  });

  const handleSearch = (query: string) => {
    setActiveFilter(prev => ({ ...prev, search: query }));
  };

  const handleViewDetails = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  // Handle hash scrolling when landing on the page
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div id="hero-section" className="scroll-mt-16 md:scroll-mt-20">
        <HeroSection onSearch={handleSearch} />
      </div>
      
      <FilterSection 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Popular Destinations */}
      <section id="destinations-section" className="py-16 bg-background scroll-mt-16 md:scroll-mt-20" data-testid="destinations-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-destinations-title">
              Popular Destinations
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the world's most amazing places
            </p>
          </div>
          
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
          ) : destinations.length === 0 ? (
            <div className="text-center py-12" data-testid="no-destinations">
              <p className="text-lg text-muted-foreground">
                No destinations found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination) => (
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

      {/* Features Section */}
      <section id="features-section" className="py-16 bg-muted scroll-mt-16 md:scroll-mt-20" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Plan Your Perfect Trip
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to make your travel dreams come true
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
              <p className="text-muted-foreground">
                Find destinations based on your preferences, budget, and travel style with our intelligent search engine.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-secondary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trip Planning</h3>
              <p className="text-muted-foreground">
                Create detailed itineraries with our planning tools, including activities, accommodations, and transportation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Insights</h3>
              <p className="text-muted-foreground">
                Get recommendations from locals and fellow travelers to discover hidden gems and authentic experiences.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12 border-t border-border" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Search className="text-primary text-2xl mr-2" />
                <span className="text-xl font-bold">Travel Explorer</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Discover amazing destinations and plan unforgettable adventures around the world.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" data-testid="link-social-facebook">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" data-testid="link-social-twitter">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" data-testid="link-social-instagram">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Destinations</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Europe</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Asia</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Americas</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Africa</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Oceania</Button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Travel</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Planning Tips</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Travel Guides</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Weather Info</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Currency Exchange</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Travel Insurance</Button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Help Center</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Contact Us</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Privacy Policy</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Terms of Service</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-muted-foreground">Cookie Policy</Button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Travel Explorer. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Destination Detail Modal */}
      <DestinationDetail
        destination={selectedDestination}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
