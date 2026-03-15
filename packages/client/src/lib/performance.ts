/**
 * Performance optimization utilities for Lighthouse metrics improvement
 * Helps reduce FCP, LCP, TBT, and Speed Index
 */

// PERF: Monitor Core Web Vitals
export function setupWebVitalsMonitoring() {
  if (typeof window === "undefined") return;

  // PERF: Use reportingObserver API for non-blocking metric collection
  if ("PerformanceObserver" in window) {
    try {
      // Monitor LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.debug("[PERF] LCP:", lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Monitor FID/INP (Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.debug("[PERF] FID/INP:", entry.processingDuration);
        }
      });
      fidObserver.observe({ entryTypes: ["first-input", "event"] });

      // Monitor CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!("hadRecentInput" in entry) || !entry.hadRecentInput) {
            clsValue += (entry as any).value;
            console.debug("[PERF] CLS:", clsValue);
          }
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    } catch (e) {
      console.warn("[PERF] Could not set up monitoring:", e);
    }
  }
}

// PERF: Defer non-critical JavaScript execution
export function deferNonCriticalWork(callback: () => void, delay: number = 0) {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => callback(), { timeout: Math.max(delay, 2000) });
  } else {
    setTimeout(callback, Math.max(delay, 100));
  }
}

// PERF: Image lazy loading with intersection observer
export function setupLazyLoadingImages() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        // PERF: Load image and remove from observer
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.dataset.src = "";
        }
        observer.unobserve(img);
      }
    });
  }, {
    // PERF: Load images before they're visible (300px threshold)
    rootMargin: "300px",
  });

  // Observe all lazy-loadable images
  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });

  return imageObserver;
}

// PERF: Debounce function to reduce function call frequency
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// PERF: Throttle function to limit function call frequency
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - (now - lastCall));
    }
  };
}

// PERF: Reduce Cumulative Layout Shift by setting size hints
export function addImageSizeHints() {
  if (typeof document === "undefined") return;

  const images = document.querySelectorAll("img:not([width]):not([height])");
  images.forEach((img) => {
    const element = img as HTMLImageElement;
    // PERF: Use natural dimensions or set reasonable defaults
    if (element.naturalWidth && element.naturalHeight) {
      element.width = element.naturalWidth;
      element.height = element.naturalHeight;
    } else {
      // PERF: Set aspect-ratio CSS to prevent layout shift
      const style = window.getComputedStyle(element);
      if (!style.aspectRatio) {
        element.style.aspectRatio = "auto";
      }
    }
  });
}

// PERF: Break down large tasks to reduce TBT
export function scheduleTask(task: () => void, priority: "high" | "normal" | "low" = "normal") {
  const isHighPriority = priority === "high";
  const timeout = priority === "low" ? 5000 : priority === "normal" ? 2000 : 0;

  if ("scheduler" in window && "yield" in window.scheduler) {
    // PERF: Use Scheduler API if available for better TBT control
    (window.scheduler as any).yield().then(task);
  } else if (isHighPriority) {
    microtask(() => task());
  } else if ("requestIdleCallback" in window) {
    requestIdleCallback(() => task(), { timeout });
  } else {
    setTimeout(task, timeout);
  }
}

// PERF: Microtask scheduling for immediate but non-blocking execution
function microtask(task: () => void) {
  Promise.resolve().then(task);
}

// PERF: Preload critical resources
export function preloadResource(href: string, as: "script" | "style" | "image" | "font" = "script") {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = as;
  link.href = href;

  if (as === "font") {
    link.crossOrigin = "anonymous";
  }

  const existingLink = document.querySelector(`link[href="${href}"]`);
  if (!existingLink) {
    document.head.appendChild(link);
  }
}

// PERF: Minimize reflows and repaints by batching DOM operations
export function batchDOMUpdates(updates: (() => void)[]) {
  // PERF: Use requestAnimationFrame to batch updates
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}

// PERF: Cache computed values to reduce recalculation
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// PERF: Enable service worker for better caching
export function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  if (process.env.NODE_ENV === "production") {
    const swPath = "/sw.js";
    navigator.serviceWorker.register(swPath).catch((error) => {
      console.warn("[PERF] Service Worker registration failed:", error);
    });
  }
}

// PERF: Cleanup function for removing unused DOM elements
export function removeUnusedDOM() {
  // PERF: Remove unused scripts, stylesheets, and other elements
  const unused = document.querySelectorAll(
    'link[rel="stylesheet"]:not([href*="critical"]):not([href*="main"]), ' +
    'script[data-unused], ' +
    'iframe[data-unused]'
  );

  unused.forEach((el) => el.remove());
}

// PERF: Monitor and log performance marks
export function markPerformance(name: string, start = true) {
  if (!("performance" in window) || !("mark" in performance)) return;

  const markName = start ? `${name}-start` : `${name}-end`;
  performance.mark(markName);

  if (!start) {
    try {
      performance.measure(name, `${name}-start`, `${name}-end`);
      const measure = performance.getEntriesByName(name)[0];
      if (measure) {
        console.debug(`[PERF] ${name}: ${measure.duration.toFixed(2)}ms`);
      }
    } catch (e) {
      console.warn(`[PERF] Could not measure ${name}:`, e);
    }
  }
}

export default {
  setupWebVitalsMonitoring,
  deferNonCriticalWork,
  setupLazyLoadingImages,
  debounce,
  throttle,
  addImageSizeHints,
  scheduleTask,
  preloadResource,
  batchDOMUpdates,
  memoize,
  registerServiceWorker,
  removeUnusedDOM,
  markPerformance,
};
