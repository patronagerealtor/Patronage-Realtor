import { createRoot } from "react-dom/client";
import { requireEnv } from "./config/env";
import App from "./App";
import "./index.css";
// PERF: Import performance utilities for optimization
import { 
  setupWebVitalsMonitoring, 
  deferNonCriticalWork, 
  setupLazyLoadingImages,
  registerServiceWorker,
  markPerformance,
  addImageSizeHints,
} from "./lib/performance";

// PERF: Mark app initialization start
markPerformance("app-init");

requireEnv();

// PERF: Create root and render app immediately for fastest FCP
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// PERF: Setup Web Vitals monitoring in background (non-blocking)
markPerformance("web-vitals-setup");
deferNonCriticalWork(() => {
  setupWebVitalsMonitoring();
  markPerformance("web-vitals-setup", false);
}, 100);

// PERF: Setup lazy loading for images after initial render
markPerformance("lazy-load-setup");
deferNonCriticalWork(() => {
  setupLazyLoadingImages();
  addImageSizeHints();
  markPerformance("lazy-load-setup", false);
}, 500);

// PERF: Register service worker for offline support and caching
markPerformance("service-worker-setup");
deferNonCriticalWork(() => {
  registerServiceWorker();
  markPerformance("service-worker-setup", false);
}, 2000);

// PERF: Track app initialization completion
markPerformance("app-init", false);

