import { Button } from "@/components/ui/button";
import { FilterState } from "@/types/destination";

interface FilterSectionProps {
  activeFilter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export default function FilterSection({ activeFilter, onFilterChange }: FilterSectionProps) {
  const filters = [
    { key: "all", label: "All Destinations", type: "clear" },
    { key: "europe", label: "Europe", type: "region" },
    { key: "asia", label: "Asia", type: "region" },
    { key: "americas", label: "Americas", type: "region" },
    { key: "adventure", label: "Adventure", type: "tag" },
    { key: "beach", label: "Beach", type: "tag" },
    { key: "culture", label: "Culture", type: "tag" }
  ];

  const handleFilterClick = (filter: any) => {
    if (filter.type === "clear") {
      onFilterChange({ region: null, tag: null, search: "" });
    } else if (filter.type === "region") {
      onFilterChange({ 
        region: filter.key, 
        tag: null, 
        search: activeFilter.search 
      });
    } else if (filter.type === "tag") {
      onFilterChange({ 
        region: null, 
        tag: filter.key, 
        search: activeFilter.search 
      });
    }
  };

  const isActive = (filter: any) => {
    if (filter.type === "clear") {
      return !activeFilter.region && !activeFilter.tag;
    } else if (filter.type === "region") {
      return activeFilter.region === filter.key;
    } else if (filter.type === "tag") {
      return activeFilter.tag === filter.key;
    }
    return false;
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20" data-testid="filter-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in-stagger">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={isActive(filter) ? "default" : "outline"}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-lg ${
                isActive(filter)
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105 animate-pulse-glow"
                  : "bg-white/80 text-foreground border-2 border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 hover:text-blue-700"
              }`}
              onClick={() => handleFilterClick(filter)}
              data-testid={`filter-button-${filter.key}`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
