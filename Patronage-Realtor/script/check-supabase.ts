/**
 * Run from project root: npx tsx script/check-supabase.ts
 * Requires .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 */
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env");
const result = config({ path: envPath });
if (!result.parsed || Object.keys(result.parsed).length === 0) {
  console.error("Could not load .env from:", envPath);
  console.error("Ensure the file exists and contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (one per line).");
}

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? "";

async function main() {
  console.log("Checking Supabase connectivity...\n");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing env. In project root (Patronage-Realtor), create .env with:");
    console.error("  VITE_SUPABASE_URL=https://your-project.supabase.co");
    console.error("  VITE_SUPABASE_ANON_KEY=your-anon-key");
    console.error("\nGet these from Supabase Dashboard → Project Settings → API.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { count, error } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Supabase error:", error.message);
      console.error("Code:", error.code);
      process.exit(1);
    }

    console.log("Connected to Supabase.");
    console.log("Properties table is reachable. Row count:", count ?? 0);
    process.exit(0);
  } catch (e) {
    console.error("Connection failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

main();
