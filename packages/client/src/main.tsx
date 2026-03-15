import { createRoot } from "react-dom/client";
import { requireEnv } from "./config/env";
import App from "./App";
import "./index.css";

requireEnv();

// Render app immediately
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

