import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesProvider } from "@/contexts/favorites-context";
import Home from "@/pages/home";
import DestinationPage from "@/pages/destination";
import Favorites from "@/pages/favorites";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/destination/:id" component={DestinationPage} />
      <Route path="/favorites" component={Favorites} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Configure base path for GitHub Pages deployment
  const basePath = import.meta.env.PROD ? "/TravelExplorer" : "";
  
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <TooltipProvider>
          <Router base={basePath}>
            <Toaster />
            <AppRoutes />
          </Router>
        </TooltipProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}

export default App;
