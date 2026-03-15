/**
 * Vercel serverless proxy for Supabase REST API (catch-all: /api/supabase-proxy/*).
 * Bypasses ISP blocking of *.supabase.co by routing through Vercel.
 * Uses SUPABASE_URL and SUPABASE_ANON_KEY (server-side env, no VITE_ prefix).
 * Do not expose service role key — anon key only.
 */
export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({
      error: "Supabase environment variables missing",
    });
  }

  const path = req.url.replace("/api/supabase-proxy", "") || "/";
  const targetUrl = `${SUPABASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const data = await response.text();

    // Add caching headers for GET requests
    if (req.method === "GET") {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=1800');
    }

    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({
      error: "Proxy request failed",
      details: error.message,
    });
  }
}
