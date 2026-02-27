# Patronage Realtor — Project Overview

## 1. Project structure (monorepo)

- **Root**: `patronage-realtor` — npm workspaces monorepo.
- **Packages**:
  - **`packages/client`** (`@patronage/client`) — React SPA (Vite). Main frontend.
  - **`packages/server`** (`@patronage/server`) — Express server. Serves client in prod, Vite dev middleware in dev; optional API routes.
  - **`packages/shared`** (`@patronage/shared`) — Shared code (Drizzle schema, Zod). Used by server; client has alias `@shared` but currently **no client imports** from it.

```
Patronage-Realtor/
├── package.json              # Workspaces root
├── tsconfig.json             # Root TS (includes all packages)
├── scripts/
│   └── build.ts              # Client Vite build + server esbuild bundle
├── packages/
│   ├── client/               # SPA
│   │   ├── src/
│   │   │   ├── App.tsx, main.tsx
│   │   │   ├── pages/        # Route-level pages
│   │   │   ├── components/   # UI, layout, feature components
│   │   │   ├── hooks/
│   │   │   ├── lib/          # Utils, Supabase, stores
│   │   │   └── types/
│   │   ├── public/
│   │   ├── vite.config.ts
│   │   ├── postcss.config.js
│   │   └── tsconfig.json
│   ├── server/
│   │   ├── index.ts          # Entry (duplicate of src/index.ts)
│   │   ├── src/
│   │   │   ├── index.ts      # Express app, static, Vite dev
│   │   │   ├── routes.ts
│   │   │   ├── static.ts
│   │   │   ├── vite.ts
│   │   │   └── storage.ts
│   │   ├── drizzle.config.ts
│   │   └── package.json      # No dependencies listed (see scripts/build.ts allowlist)
│   └── shared/
│       └── src/
│           └── schema.ts     # Drizzle users table, Zod schemas
```

---

## 2. Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript |
| **Routing** | wouter |
| **Build (client)** | Vite 7, @vitejs/plugin-react |
| **Styling** | Tailwind CSS 4, tailwindcss-animate, tw-animate-css |
| **UI primitives** | Radix UI (dialog, tabs, select, accordion, etc.) |
| **Forms** | react-hook-form, @hookform/resolvers, zod |
| **Data / server state** | TanStack React Query, Supabase client |
| **Charts** | recharts |
| **Icons** | lucide-react |
| **3D** | three, @react-three/fiber |
| **Images** | browser-image-compression |
| **Backend** | Express, Node (tsx in dev) |
| **DB / shared** | Drizzle ORM, Zod (shared package) |

---

## 3. Key files and purposes

| File | Purpose |
|------|---------|
| **Client** | |
| `main.tsx` | React root; mounts `App`. |
| `App.tsx` | Router (wouter), QueryClientProvider, TooltipProvider, Toaster. All routes defined here. |
| `index.css` | Tailwind imports, theme variables (@theme inline), base styles. |
| `lib/supabase.ts` | Supabase client, `PropertyRow` type, `fetchPropertiesFromSupabase`, `uploadPropertyImages`, webinar helpers. |
| `lib/queryClient.ts` | TanStack Query client + `apiRequest` / `getQueryFn` for API calls. |
| `lib/formatIndianPrice.ts` | Indian price formatting (lakh/crore). |
| `lib/investmentStorage.ts` | localStorage for investment commercial/land listings (add/remove). |
| `hooks/use-properties.ts` | React Query wrapper for fetching properties from Supabase. |
| `hooks/useDataEntryProperties.ts` | Data entry: Supabase vs local fallback, mutations. |
| `hooks/useInvestmentProperties.ts` | Investment insert: read/write from investmentStorage. |
| `hooks/use-toast.ts` | Toast hook (sonner). |
| **Server** | |
| `packages/server/index.ts` or `src/index.ts` | Express app: json/urlencoded, logging, `registerRoutes`, static or Vite dev, listen on PORT. |
| `server/src/static.ts` | Serves `dist/public` (client build), SPA fallback to index.html. |
| `server/src/vite.ts` | Vite dev middleware (HMR) when not production. |
| `server/src/routes.ts` | API route registration (currently minimal). |
| **Build** | |
| `scripts/build.ts` | Deletes dist, runs Vite build (client), then esbuild server bundle (entry `server/index.ts`, allowlisted deps). |
| **Config** | |
| `packages/client/vite.config.ts` | React + Tailwind plugins, envDir root, path aliases (`@/`, `@shared`, `@assets`), build outDir `../../dist/public`. |
| `vite-plugin-meta-images.ts` | Injects og:image / twitter:image with deployment URL. |

---

## 4. Package.json dependencies

### Root

```json
"devDependencies": {
  "concurrently": "^8.2.2",
  "npm-run-all": "^4.1.5"
}
```

- No production deps at root. Workspaces: `packages/client`, `packages/server`, `packages/shared`.

### packages/client

- **Notable dependencies**: react, react-dom, wouter, @tanstack/react-query, @supabase/supabase-js, react-hook-form, zod, recharts, framer-motion, lucide-react, radix-ui/*, tailwindcss, browser-image-compression, three, @react-three/fiber, date-fns, react-markdown, remark-gfm, next-themes, sonner, vaul, cmdk, embla-carousel-react, etc.
- **Dev**: vite, @vitejs/plugin-react, typescript, @tailwindcss/vite, @tailwindcss/postcss, tailwindcss, postcss, autoprefixer, @types/*.

### packages/server

- **dependencies**: `{}`
- **devDependencies**: `{}`
- Server build in `scripts/build.ts` uses an **allowlist** of deps to bundle (express, pg, drizzle-orm, etc.); those are expected to be installed (e.g. at root or in server) when the build runs. Current `package.json` does not list them — **potential mismatch** if build is run from server workspace only.

### packages/shared

- No dependencies in the snippet; schema uses drizzle-orm, zod (likely hoisted from root or server).

---

## 5. Configuration files

| Config | Location | Notes |
|--------|----------|------|
| **TypeScript** | Root `tsconfig.json` | Includes client, shared, server; paths `@/*` → client/src, `@shared/*` → shared. |
| **TypeScript** | `packages/client/tsconfig.json` | jsx: react-jsx, moduleResolution: bundler, paths for `@/`, `@shared/`. |
| **Vite** | `packages/client/vite.config.ts` | React, Tailwind, meta-images plugin; envDir root; alias; build to `../../dist/public`. |
| **PostCSS** | `packages/client/postcss.config.js` | tailwindcss, autoprefixer. |
| **Drizzle** | `packages/server/drizzle.config.ts` | DB config for server/shared. |
| **ESLint** | — | No `.eslintrc*` or `eslint.config.*` found in repo. |

---

## 6. Main components and pages

### Pages (routes)

- **Home** (`/`) — Home
- **Properties** (`/properties`, `/properties/:slug`) — Explore/list properties, slug opens detail.
- **Investment** (`/investment`) — Investment landing; commercial/land from localStorage or defaults.
- **Investment Insert** (`/investment/insert`) — Hidden; add commercial/land (no nav link).
- **Interiors** (`/interiors`) — Interiors + package selector + InteriorPriceCalculator.
- **Calculators** (`/calculators`) — Tabs: Smart EMI, Rent vs Buy, Eligibility, Ownership; Recharts.
- **Data Entry** (`/data-entry`) — Residential property CRUD (Supabase/local).
- **Webinars** (`/webinars`) — Webinar listing and registration.
- **Blogs** (`/blogs`, `/blogs/:id`) — Blog list/detail.
- **About Us** (`/about-us`) — About page.
- **Not found** — Catch-all.

### Key components

- **Layout**: `Header`, `Footer`.
- **Property**: `PropertyDetailDialog` (overlay), `PropertyForm`, `PropertyList`; sections (Overview, Details, About, FloorPlan, Amenities, Gallery, Map, Similar, ContactCard).
- **Home**: `Hero`, `FeaturedProperties`, `PropertySearch`, `AboutPreview`, `WhyChooseUs`, `Reels`, `Interiors` (strip), `ContactCTA`.
- **UI**: Large set under `components/ui/` (Radix-based: dialog, tabs, select, card, button, input, etc.).

---

## 7. Obvious issues and areas for optimization

### Bundle size and performance

- **No route-based code splitting**: All pages are imported synchronously in `App.tsx`. Heavy pages (e.g. **Calculators** with Recharts, **Webinar**, **Interiors**) are in the main bundle.
- **Recommendation**: Use `React.lazy()` + `Suspense` for route components (e.g. Calculators, DataEntry, Investment, Webinar) to reduce initial load and improve LCP.
- **Recharts**: Only needed on Calculators; lazy-loading the Calculators page would pull Recharts in a chunk.
- **Three.js / @react-three/fiber**: Used on Home (or similar); ensure they are lazy-loaded if not above-the-fold.

### Code quality

- **Calculators.tsx** is very large (~2100+ lines). Split into sub-components or tab-specific modules (Smart EMI, Rent vs Buy, etc.).
- **Duplicate server entry**: Both `packages/server/index.ts` and `packages/server/src/index.ts` exist and are similar; one should be the single entry and build script aligned.
- **No ESLint**: No lint config in repo; consider adding ESLint + TypeScript rules for consistency and catch bugs.
- **Shared package**: Client has `@shared` alias but does not import from it; shared is effectively server-only. Either use it (e.g. shared types) or remove the alias to avoid confusion.

### Data and state

- **Query client defaults**: `staleTime: Infinity` and `refetchOnWindowFocus: false` — good for static-ish data; ensure intentional for all queries.
- **Investment data**: Stored only in localStorage; no backup or sync across devices.

### Build and deploy

- **Server build**: `scripts/build.ts` uses `entryPoints: ["server/index.ts"]` and reads `package.json` (relative to script cwd). When run via `npm --workspace=packages/server run build`, cwd is `packages/server`, so entry is `server/index.ts` (i.e. root of server package). Confirm that path and that all allowlisted deps are installed where the build runs.
- **Client build output**: Goes to `../../dist/public` (relative to client), i.e. repo-level `dist/public`. Static server serves this; ensure CI/deploy produces the same layout.

### Other

- **Image loading**: Some `<img>` use `loading="lazy"` (Properties, Interiors, MapSection). Good; consider consistent use and explicit dimensions to reduce CLS.
- **useMemo / useCallback**: Used in several places (Calculators, Properties, Home, etc.); no widespread `React.memo` on list items — add where lists are long and re-renders are expensive.

---

## 8. Performance patterns (existing and gaps)

### Existing

- **TanStack Query**: Centralized client, cache for properties; avoids refetch storms.
- **Lazy images**: `loading="lazy"` on some images.
- **Image compression**: `browser-image-compression` used for uploads (Supabase, Investment insert).
- **useMemo/useCallback**: Used in data-heavy pages (filtering, derived lists, handlers).

### Gaps

- **No route-level code splitting** (no `React.lazy` for pages).
- **No React.memo** on heavy list/item components (e.g. property cards, calculator blocks).
- **No service worker / PWA** for caching or offline.
- **Fonts**: Google Fonts loaded via `@import` in CSS; consider self-hosting or `font-display: swap` to avoid blocking.
- **Recharts**: Large library; only needed on one page; ideal candidate for lazy loading via route split.

---

## 9. Quick reference

| Task | Command |
|------|--------|
| Dev (server, serves client via Vite in dev) | `npm run dev` |
| Dev (client only, port 5000) | `npm run dev:client` |
| Dev (server only) | `npm run dev:server` |
| Build (client + server) | `npm run build` |
| Build client only | `npm run build:client` |
| Production start | `npm run start` |
| Type check (all workspaces) | `npm run check` |
