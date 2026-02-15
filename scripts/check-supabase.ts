/**
 * Run from project root: npx tsx scripts/check-supabase.ts
 * Uses the same .env as the client: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * Verifies both tables used by the app: properties (Home/Properties) and property_listings (DataEntry).
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
    console.error("Missing env. In project root, create .env with:");
    console.error("  VITE_SUPABASE_URL=https://your-project.supabase.co");
    console.error("  VITE_SUPABASE_ANON_KEY=your-anon-key");
    console.error("\nGet these from Supabase Dashboard → Project Settings → API.");
    console.error("Same env is used by the client (DataEntry and Properties pages).");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  let ok = true;

  try {
    const { count, error } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[properties] Supabase error:", error.message, "Code:", error.code);
      ok = false;
    } else {
      console.log("[properties] Table reachable. Row count:", count ?? 0);
    }
  } catch (e) {
    console.error("[properties] Connection failed:", e instanceof Error ? e.message : e);
    ok = false;
  }

  try {
    const { count, error } = await supabase
      .from("property_listings")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[property_listings] Supabase error:", error.message, "Code:", error.code);
      console.error("  → DataEntry page needs this table. Run docs/supabase-property-listings.sql in Supabase SQL Editor.");
      ok = false;
    } else {
      console.log("[property_listings] Table reachable (DataEntry). Row count:", count ?? 0);
    }
  } catch (e) {
    console.error("[property_listings] Connection failed:", e instanceof Error ? e.message : e);
    ok = false;
  }

  if (ok) {
    console.log("\nSupabase is ready. DataEntry will persist to property_listings when the client runs with this .env.");
    process.exit(0);
  }
  process.exit(1);
}

main();
