import { Link, useLocation } from "wouter";
import { Compass, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Navigation() {
  const [location, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (sectionId: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu
    if (location !== "/" && !location.startsWith("/#")) {
      // Navigate to home with hash for scrolling
      navigate(`/#${sectionId}`);
    } else {
      // Already on home, scroll and update hash
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash for deep linking and active states
        window.history.replaceState(null, '', `/#${sectionId}`);
      }
    }
  };

  const isHome = location === "/" || location.startsWith("/#");
  const currentHash = window.location.hash;

  const navItems = [
    { 
      href: "/#hero-section", 
      label: "Home", 
      active: isHome && (currentHash === "#hero-section" || currentHash === ""),
      onClick: () => handleNavigation('hero-section')
    },
    { 
      href: "/#destinations-section", 
      label: "Destinations", 
      active: isHome && currentHash === "#destinations-section",
      onClick: () => handleNavigation('destinations-section')
    },
    { 
      href: "/#features-section", 
      label: "About", 
      active: isHome && currentHash === "#features-section",
      onClick: () => handleNavigation('features-section')
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-border sticky top-0 z-50 transition-all duration-300" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group transition-all duration-300" data-testid="link-home">
            <Compass className="text-primary text-2xl mr-2 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110" />
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Travel Explorer</span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                item.onClick ? (
                  <button
                    key={`nav-${index}-${item.label}`}
                    onClick={item.onClick}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                      item.active
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:shadow-md transform hover:scale-105"
                    }`}
                    data-testid={`link-${item.label.toLowerCase()}`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <span className="relative z-10">
                      {item.label}
                    </span>
                  </button>
                ) : (
                  <Link
                    key={`nav-link-${index}-${item.label}`}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                      item.active
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:shadow-md transform hover:scale-105"
                    }`}
                    data-testid={`link-${item.label.toLowerCase()}`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <span className="relative z-10">
                      {item.label}
                    </span>
                  </Link>
                )
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="button-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item, index) => (
                    item.onClick ? (
                      <button
                        key={`mobile-nav-${index}-${item.label}`}
                        onClick={item.onClick}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left ${
                          item.active
                            ? "text-foreground bg-muted"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                        data-testid={`mobile-link-${item.label.toLowerCase()}`}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={`mobile-link-${index}-${item.label}`}
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          item.active
                            ? "text-foreground bg-muted"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                        data-testid={`mobile-link-${item.label.toLowerCase()}`}
                      >
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
