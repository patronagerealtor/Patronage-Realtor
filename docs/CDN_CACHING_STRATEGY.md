# CDN & Caching Strategy

This project uses **Supabase** for the database and **Cloudinary** for assets. This doc describes the CDN and caching setup to minimize memory use and maximize performance.

---

## 1. Cloudinary (Images & Video)

### Delivery optimizations (implemented)

- **f_auto** – Optimal format per browser (WebP/AVIF with JPEG fallback). Reduces size ~25–35%.
- **q_auto** – Automatic quality; avoids over-quality and reduces bandwidth.
- **dpr_auto** – Device pixel ratio for sharp retina images without over-fetching.
- **Responsive srcset** – `SupabaseImage` with `transformWidth` gets multiple widths (320–1536px). Browser requests one size → less cache and bandwidth.
- **Lazy loading** – Below-the-fold images use `loading="lazy"`. LCP images use `fetchPriority="high"`.

### Where it’s applied

- **`lib/cloudinary.ts`** – `getTransformedImageUrl()` and `getCloudinarySrcSet()` build URLs with the above params.
- **`components/shared/SupabaseImage.tsx`** – All Cloudinary URLs get at least `f_auto,q_auto`. With `transformWidth`, images get a responsive `srcSet` and sensible `sizes`.

### Recommended TTL (Cloudinary dashboard / CDN)

- **Images (transformed):** 300–900 s (5–15 min) for frequently updated content; longer for static assets.
- **Static assets (logos, icons):** Up to 1 year (e.g. 31536000 s) with cache versioning in path/query if needed.

### Cache busting

- Cloudinary URLs include version or path; new uploads get new URLs. No extra query versioning required for uploads.
- For static files (e.g. `/logo/logo-full.png`), use path versioning (e.g. `logo-v2.png`) when content changes.

---

## 2. Supabase (Database & API)

### Client-side cache (React Query)

- **Properties list:** `staleTime: 5 minutes` in `useProperties` and `useDataEntryProperties`. Reduces repeat requests to Supabase.
- **Refetch:** `refetchOnWindowFocus: false` for properties to avoid unnecessary refetches.

### Server / edge (recommendations)

- **PostgREST:** Supabase returns `Cache-Control` and `ETag`. Use them at your edge (e.g. Vercel/Cloudflare) with short TTL (e.g. 60–300 s) for list endpoints.
- **RLS:** Row-level security is enabled; only required rows are returned, which keeps payloads and cache usage smaller.
- **Realtime:** Use subscriptions only for data that must stay live; avoid caching those responses long.

---

## 3. Cache headers (summary)

| Asset type              | Suggested TTL        | Notes                          |
|-------------------------|----------------------|--------------------------------|
| Cloudinary images       | 5–15 min (dynamic)  | f_auto, q_auto, srcset in use  |
| Cloudinary static       | 1 year               | Version path when changing     |
| Supabase API (properties) | 5 min (client)    | React Query staleTime          |
| Supabase at edge        | 1–5 min             | If you put a CDN in front      |
| JS/CSS/fonts (build)    | 1 year               | Vite build hashes filenames    |

---

## 4. Monitoring

Track (e.g. in Cloudinary dashboard and your hosting/CDN):

- **Cache hit ratio** – Aim >85% for static/transformed images.
- **Bandwidth** – Should drop with f_auto, q_auto, and srcset.
- **Response time** – Should improve with edge caching and smaller payloads.
- **Error rates** – Ensure no regressions after changing TTL or transforms.

---

## 5. Implementation checklist

- [x] Cloudinary: f_auto, q_auto, dpr_auto on image URLs
- [x] Cloudinary: responsive srcset via `getCloudinarySrcSet` and `SupabaseImage`
- [x] Lazy loading for non-LCP images; fetchPriority for LCP where needed
- [x] React Query staleTime (5 min) for properties
- [ ] Configure Cloudinary delivery TTL in dashboard (per asset type)
- [ ] Optional: edge caching for Supabase API (e.g. Vercel/Cloudflare)
- [ ] Optional: cache metrics dashboard / alerts

---

## 6. Key code references

- **Image URL + srcset:** `packages/client/src/lib/cloudinary.ts` – `getTransformedImageUrl`, `getCloudinarySrcSet`
- **Image component:** `packages/client/src/components/shared/SupabaseImage.tsx`
- **Supabase image URL (non-Cloudinary):** `packages/client/src/lib/supabase.ts` – `getTransformedImageUrl`
- **Properties cache:** `packages/client/src/hooks/use-properties.ts`, `useDataEntryProperties.ts`
