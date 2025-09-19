import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onDirectSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch, onDirectSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (onDirectSearch) {
      onDirectSearch(searchQuery);
    } else {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section 
      className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
      data-testid="hero-section"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-indigo-900/70 animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-gradient-text" data-testid="text-hero-title">
          Discover Your Next Adventure
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up delay-300" data-testid="text-hero-subtitle">
          Explore breathtaking destinations around the world
        </p>
        
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 max-w-xl mx-auto border border-white/20 animate-fade-in-up delay-500 hover:shadow-3xl transition-all duration-500 hover:scale-105">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                Where to?
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="input-search"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-blue-300/50 w-full sm:w-auto"
                onClick={handleSearch}
                data-testid="button-search"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
