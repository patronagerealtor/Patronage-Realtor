/**
 * Vercel serverless handler for Microsoft Bing IndexNow submissions.
 *
 * Proxies URL submissions from the client to the IndexNow API so the key
 * stays server-side and CORS is avoided. Set INDEXNOW_KEY and SITE_DOMAIN
 * in Vercel environment variables.
 *
 * POST body: { urlList: string[] }
 * Forwards to: https://api.indexnow.org/indexnow
 *
 * @see https://www.indexnow.org/documentation
 */

const INDEXNOW_API_URL = "https://api.indexnow.org/indexnow";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).setHeader("Allow", "POST").json({ error: "Method not allowed" });
  }

  const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
  const SITE_DOMAIN = process.env.SITE_DOMAIN;

  if (!INDEXNOW_KEY || !SITE_DOMAIN) {
    return res.status(503).json({
      error: "IndexNow not configured",
      detail: "Set INDEXNOW_KEY and SITE_DOMAIN in environment variables.",
    });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }
  const urlList = body?.urlList;
  if (!Array.isArray(urlList)) {
    return res.status(400).json({ error: "Missing or invalid urlList (must be an array)" });
  }

  const normalized = urlList
    .filter((u) => typeof u === "string" && u.trim().startsWith("http"))
    .slice(0, 10_000);

  if (normalized.length === 0) {
    return res.status(200).json({ ok: true, submitted: 0 });
  }

  const host = SITE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const keyLocation = `https://${host}/${INDEXNOW_KEY}.txt`;

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: normalized,
  };

  try {
    const response = await fetch(INDEXNOW_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (!response.ok) {
      console.warn("[IndexNow] API error:", response.status, text);
      return res.status(response.status).send(text);
    }

    return res.status(200).json({ ok: true, submitted: normalized.length });
  } catch (err) {
    console.error("[IndexNow] request failed:", err);
    return res.status(502).json({
      error: "IndexNow request failed",
      detail: err.message,
    });
  }
}
