import { hydrateRoot } from "react-dom/client";
import { requireEnv } from "./config/env";
import App from "./App";
import "./index.css";

requireEnv();

// Hydrate the statically generated DOM
hydrateRoot(document.getElementById("root")!, <App />);

