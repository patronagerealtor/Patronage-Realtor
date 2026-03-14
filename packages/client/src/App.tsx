import { Component, type ReactNode } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 600 }}>
          <h1 style={{ color: "#c00" }}>Something went wrong</h1>
          <pre style={{ background: "#f5f5f5", padding: 12, overflow: "auto", fontSize: 12 }}>
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{ marginTop: 12, padding: "8px 16px" }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Interiors from "./pages/Interiors";
import AboutUs from "./pages/AboutUs";
import Calculators from "./pages/Calculators";
import NotFound from "./pages/not-found";
import DataEntry from "./pages/DataEntry";
import Blogs from "./pages/Blogs";
import Investment from "./pages/Investment";
import InvestmentDetails from "./pages/InvestmentDetails";
import { Webinar } from "./pages/Webinar";
import { LoginPage, ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthPhoneGate } from "./components/auth/AuthPhoneGate";

import { env } from "./config/env";
const dataEntryAllowedEmails = env.dataEntryAllowedEmail || "";

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

      <Route path="/webinars" component={Webinar} />
      <Route path="/blogs/:id" component={Blogs} />
      <Route path="/blogs" component={Blogs} />

      <Route path="/interiors" component={Interiors} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/calculators" component={Calculators} />
      <Route path="/calculators/home-loan-emi-calculator" component={Calculators} />
      <Route path="/calculators/rent-vs-buy" component={Calculators} />
      <Route path="/calculators/home-loan-eligibility" component={Calculators} />
      <Route path="/calculators/ownership-cost" component={Calculators} />
      <Route path="/login" component={LoginPage} />
      <Route path="/data-entry">
        {() => (
          <ProtectedRoute allowedEmails={dataEntryAllowedEmails}>
            <DataEntry />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <MotionConfig reducedMotion="user">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <AuthPhoneGate>
              <Router />
            </AuthPhoneGate>
          </TooltipProvider>
        </QueryClientProvider>
      </MotionConfig>
    </AppErrorBoundary>
  );
}

export default App;
