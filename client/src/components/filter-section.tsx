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
    <section className="py-8 bg-muted" data-testid="filter-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={isActive(filter) ? "default" : "outline"}
              className={`px-6 py-2 rounded-full transition-colors ${
                isActive(filter)
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-foreground border-border hover:bg-muted"
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
