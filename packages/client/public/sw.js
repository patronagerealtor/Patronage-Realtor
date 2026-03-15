/**
 * Service Worker for Performance Optimization
 * Handles caching, offline support, and network optimization
 * 
 * PERF: Service workers enable:
 * - Offline functionality
 * - Aggressive caching of static assets
 * - Network request optimization
 * - Background sync
 */

const CACHE_VERSION = "v1";
const CACHE_NAME = `patronage-realtor-${CACHE_VERSION}`;

// PERF: Critical assets that must be cached immediately
const CRITICAL_ASSETS = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
];

// PERF: Assets to cache on first request
const CACHEABLE_PATTERNS = [
  { pattern: /\.js$/i, maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  { pattern: /\.css$/i, maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  { pattern: /\.woff2?$/i, maxAge: 365 * 24 * 60 * 60 * 1000 }, // 1 year
  { pattern: /\.(png|jpg|jpeg|gif|svg)$/i, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
];

// PERF: Offline fallback page
const OFFLINE_FALLBACK = `
<!DOCTYPE html>
<html>
  <head>
    <title>Offline - Patronage Realtor</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background: #f5f5f5;
      }
      .container {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      h1 { color: #333; }
      p { color: #666; margin: 1rem 0; }
      button {
        padding: 0.75rem 1.5rem;
        background: #000;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
      }
      button:hover { background: #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>You're Offline</h1>
      <p>Check your internet connection and try again.</p>
      <button onclick="location.reload()">Retry</button>
    </div>
  </body>
</html>
`;

// PERF: Install event - cache critical assets immediately
self.addEventListener("install", (event: ExtendableEvent) => {
  console.log("[SW] Installing service worker...");
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache critical assets immediately
      return cache.addAll(CRITICAL_ASSETS).catch(() => {
        console.warn("[SW] Some critical assets could not be cached");
      });
    })
  );
  
  // PERF: Force new service worker to take over immediately
  self.skipWaiting();
});

// PERF: Activate event - cleanup old caches
self.addEventListener("activate", (event: ExtendableEvent) => {
  console.log("[SW] Activating service worker...");
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  
  // PERF: Take control of clients immediately
  self.clients.claim();
});

// PERF: Fetch event - implement caching strategies
self.addEventListener("fetch", (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // PERF: Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // PERF: Skip cross-origin requests to avoid CORS issues
  if (url.origin !== self.location.origin) {
    return;
  }

  // PERF: Cache-first strategy for static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          // PERF: Update cache in background for next load
          fetchAndCache(request);
          return response;
        }

        return fetch(request)
          .then((response) => {
            // PERF: Only cache successful responses
            if (!response || response.status !== 200 || response.type !== "basic") {
              return response;
            }

            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          })
          .catch(() => {
            // PERF: Return offline fallback for navigation requests
            if (request.mode === "navigate") {
              return new Response(OFFLINE_FALLBACK, {
                headers: { "Content-Type": "text/html" },
              });
            }
            throw new Error("Network request failed");
          });
      })
    );
  }
  // PERF: Network-first strategy for API calls
  else if (url.pathname.startsWith("/api")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // PERF: Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // PERF: Return cached API response if network fails
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            return new Response(
              JSON.stringify({ error: "Offline" }),
              { status: 503, headers: { "Content-Type": "application/json" } }
            );
          });
        })
    );
  }
  // PERF: Default: Network-first, fallback to cache
  else {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            if (request.mode === "navigate") {
              return new Response(OFFLINE_FALLBACK, {
                headers: { "Content-Type": "text/html" },
              });
            }
            throw new Error("Network request failed");
          });
        })
    );
  }
});

// PERF: Helper function to determine if a path is a static asset
function isStaticAsset(pathname: string): boolean {
  return /\.(js|css|woff2?|png|jpg|jpeg|gif|svg|ico)$/i.test(pathname);
}

// PERF: Helper function to fetch and cache in background
function fetchAndCache(request: Request): Promise<Response | undefined> {
  return fetch(request).then((response) => {
    if (response.status === 200) {
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    return response;
  });
}

// PERF: Message handler for client communication
self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === "CLEAR_CACHE") {
    caches.delete(CACHE_NAME).then(() => {
      console.log("[SW] Cache cleared");
    });
  }
});

console.log("[SW] Service Worker loaded");
