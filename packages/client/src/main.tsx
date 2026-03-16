import { createRoot } from "react-dom/client";
import { requireEnv } from "./config/env";
import App from "./App";
import "./index.css";
import analytics from "./lib/analytics";

requireEnv();

// Initialize analytics tracking
// This will automatically track page views, scroll depth, clicks, etc.
console.log('Analytics initialized');

// Render app immediately
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

