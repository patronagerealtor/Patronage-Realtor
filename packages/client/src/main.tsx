import { createRoot } from "react-dom/client";
import { requireEnv } from "./config/env";
import App from "./App";
import "./index.css";

requireEnv();
createRoot(document.getElementById("root")!).render(<App />);
