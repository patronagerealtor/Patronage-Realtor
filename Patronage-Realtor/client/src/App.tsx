import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import Interiors from "@/pages/Interiors";
import AboutUs from "@/pages/AboutUs";
import Calculators from "@/pages/Calculators";
import NotFound from "@/pages/not-found";

// ✅ FIX 1: Use curly braces { } for named import
import { Webinar } from "@/pages/Webinar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties" component={Properties} />

      {/* ✅ FIX 2: Change path to plural '/webinars' to match Header */}
      <Route path="/webinars" component={Webinar} />

      <Route path="/interiors" component={Interiors} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/calculators" component={Calculators} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
