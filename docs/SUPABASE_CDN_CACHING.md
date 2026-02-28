# Supabase CDN & Caching

## Overview

Supabase Storage is served over a global CDN. This doc covers how to get the most out of caching and image delivery for this project.

## 1. Smart CDN (Pro plan and above)

- **Long CDN caching**: Assets are cached at the edge as long as possible.
- **Automatic invalidation**: When files are updated or deleted, the CDN cache is invalidated (propagation can take up to ~60 seconds).
- **Query string flexibility**: The CDN achieves good cache hit rates even when query params (e.g. image transform params) differ, where the underlying file is unchanged.

If you’re on Pro (or higher), Smart CDN is already in use for Storage.

## 2. Cache-Control on upload

When uploading files, you can set `cacheControl` so the browser caches responses for a chosen TTL:

```ts
await supabase.storage.from('bucket').upload(path, file, {
  cacheControl: '3600', // 1 hour in seconds; use '31536000' for 1 year for immutable assets
});
```

- Default is often 1 hour. For rarely changing images (e.g. property photos), a longer value (e.g. 1 day or 1 year) can reduce repeat requests.
- For assets that change in place, use a shorter TTL or avoid reusing the same path (see below).

## 3. Image transformations (Pro plan)

Storage supports on-the-fly image resizing and optimization:

- **URL shape**:  
  `https://<project>.supabase.co/storage/v1/render/image/public/<bucket>/<path>?width=500&height=300&quality=80`
- **Benefits**: Smaller responses, automatic WebP where supported, less egress.
- **In this app**: `getTransformedImageUrl()` in `packages/client/src/lib/supabase.ts` turns an object URL into a render URL with optional `width`, `height`, `quality`. Use it (or the `SupabaseImage` component) for thumbnails and responsive images.

Docs: [Storage Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations).

## 4. Cache-friendly update strategy

To avoid stale CDN/browser cache when content changes:

- **Prefer new paths** for new versions (e.g. include a version or timestamp in the path or filename) instead of overwriting the same path.
- Alternatively use versioned query params (e.g. `?v=2`) so the CDN treats it as a new resource.

## 5. Client-side: lazy loading

Images (and other media) loaded from Supabase should use lazy loading when they’re below the fold:

- Use the shared **`SupabaseImage`** component for Supabase (and other) image URLs; it sets `loading="lazy"` and `decoding="async"` by default.
- For the main LCP image (e.g. hero or first property image), use `fetchPriority="high"` and keep `loading="eager"` so the LCP image isn’t delayed.

This reduces initial payload and improves LCP for the primary image while keeping CDN-backed images lazy-loaded.

## 6. Checklist

- [ ] Pro plan (or above) for Smart CDN and image transformations.
- [ ] Set `cacheControl` on upload when appropriate (e.g. long TTL for static property images).
- [ ] Use `getTransformedImageUrl()` or `SupabaseImage` for thumbnails/resized images.
- [ ] Use `SupabaseImage` (or equivalent) with lazy loading for below-the-fold Supabase images.
- [ ] Prefer new paths (or versioned query params) when updating assets to avoid stale cache.
