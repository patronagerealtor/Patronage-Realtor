import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { MotionConfig } from "framer-motion";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Interiors from "./pages/Interiors";
import AboutUs from "./pages/AboutUs";
import Calculators from "./pages/Calculators";
import NotFound from "./pages/not-found";
import DataEntry from "./pages/DataEntry";
import Dashboard from "./pages/Dashboard";
import Blogs from "./pages/Blogs";
import Investment from "./pages/Investment";
import InvestmentDetails from "./pages/InvestmentDetails";
import { Webinar } from "./pages/Webinar";
import { ProtectedRoute, LoginPage } from "./components/auth/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties/:slug" component={Properties} />
      <Route path="/properties" component={Properties} />
      <Route path="/investment/insert">
        {() => <Redirect to="/data-entry?mode=commercial" />}
      </Route>
      <Route path="/investment/:type/:id" component={InvestmentDetails} />
      <Route path="/investment" component={Investment} />

      {/* ✅ FIX 2: Change path to plural '/webinars' to match Header */}
      <Route path="/webinars" component={Webinar} />
      <Route path="/blogs/:id" component={Blogs} />
      <Route path="/blogs" component={Blogs} />

      <Route path="/interiors" component={Interiors} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/calculators" component={Calculators} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/data-entry">
        <ProtectedRoute allowedEmail={import.meta.env.VITE_DATA_ENTRY_ALLOWED_EMAIL}>
          <DataEntry />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </MotionConfig>
  );
}

export default App;
