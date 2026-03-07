# Deployment: Vercel + Cloudflare

## Architecture

```
User → Cloudflare (DNS + proxy, SSL) → Vercel (static SPA) → (Supabase / Cloudinary from browser)
```

- **Vercel** serves the built Vite SPA (static files). No Node server in production.
- **Supabase** is the backend (DB + Auth). All data and auth go through Supabase from the browser; RLS is enforced server-side.
- **Cloudinary** is used for media (unsigned uploads only; no API secret in the frontend).
- **Cloudflare** sits in front as DNS and optional reverse proxy. The app works with Cloudflare proxy **ON**.

## Required environment variables

Set these in **Vercel** (Project → Settings → Environment Variables). Use **Production** (and Preview if needed).

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon (public) key. Never use service_role in the client. |
| `VITE_CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name (for uploads and CDN) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | No | Unsigned image upload preset |
| `VITE_CLOUDINARY_UPLOAD_PRESET_VIDEO` | No | Unsigned video upload preset (defaults to image preset) |
| `VITE_APP_URL` | Yes (for OAuth) | Production URL, e.g. `https://yourdomain.com` (no trailing slash) |
| `VITE_AFTER_SIGNIN_REDIRECT` | No | Path after sign-in (default `/`) |
| `VITE_GOOGLE_CLIENT_ID` | No | Google OAuth client ID (if using Google sign-in) |
| `VITE_DATA_ENTRY_ALLOWED_EMAIL` | No | Comma-separated emails that can access `/data-entry` |
| `VITE_CONTACT_FORM_URL` | No | Override for contact / CTA links |
| `VITE_WEBINAR_PAYMENT_LINK` | No | Webinar payment link |
| `VITE_WEBINAR_CONTACT_FORM_URL` | No | Webinar contact form override |

Legacy names `VITE_SUPABASE_2_URL` and `VITE_SUPABASE_2_ANON_KEY` are still supported if set instead of the names above.

The app **fails fast** in production if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are missing (white screen / error). Set them in Vercel before deploying.

## Cloudflare constraints

- **DNS proxy**: Keep proxy **ON** (orange cloud) so traffic goes through Cloudflare. The app is written to work behind a reverse proxy (no hardcoded protocol or host).
- **SSL/TLS**: Use **Full (strict)** so Cloudflare → Vercel is HTTPS.
- **What Cloudflare does**: Terminates SSL, caches (if you enable it), DDoS protection, optional WAF. It does **not** run your app; Vercel serves the SPA.
- **What Cloudflare does not protect**: Supabase and Cloudinary are called directly from the browser; their URLs are not proxied through Cloudflare unless you configure them separately.

## Vercel

- **Build**: `npm run build:client` (from repo root). Output is `dist/public`.
- **SPA routing**: `vercel.json` includes a rewrite so all routes serve `index.html`. Required for client-side routing (e.g. `/about-us`, `/calculators`).
- No Next.js or server-side code. The deploy is static only.

## Local vs production

- **Local**: Copy `.env.example` to `.env` or `.env.local`. Do not commit `.env` or `.env.local`.
- **Production**: Set the variables in Vercel (and optionally in Cloudflare if you use Workers/env there). They are baked into the client bundle at **build** time.

## Common failure points

1. **White screen / "Missing required environment variables"**  
   Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel and redeploy.

2. **OAuth redirect fails or wrong URL**  
   Set `VITE_APP_URL` to your production URL (e.g. `https://yourdomain.com`). In Supabase Dashboard → Authentication → URL Configuration, set Site URL and Redirect URLs to match.

3. **404 on refresh or direct link to a route**  
   Ensure `vercel.json` has the SPA rewrite: `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`.

4. **CORS or auth errors with Supabase**  
   In Supabase, add your production domain (and Cloudflare proxy URL if different) to allowed origins. No Cloudflare-specific code is required in the app.

5. **Sitemap / SEO**
   The sitemap at `packages/client/public/sitemap.xml` uses `https://patronagerealtor.in`; update it if you deploy under a different domain. The app sets document title and meta description via `seo/usePageMeta`; ensure no `noindex` is added by mistake.

## One-click deploy

1. Connect the repo to Vercel.
2. Set the environment variables above in Vercel.
3. Deploy. Build command and output directory are in `vercel.json`.
4. Point your domain (or Cloudflare) to Vercel’s assigned URL.
