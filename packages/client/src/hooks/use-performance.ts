/**
 * PERF: React hooks for performance optimization
 * Helps reduce TBT, improve rendering, and optimize updates
 */

import { useEffect, useRef, useCallback, useMemo, useReducer } from "react";

/**
 * PERF: useDeferredValue-like hook for React 17 compatibility
 * Defers state updates to prevent blocking renders
 */
export function useDeferredState<T>(initialState: T): [T, (value: T) => void] {
  const [state, setState] = useReducer(
    (_, newState: T) => newState,
    initialState
  );

  const deferredSetState = useCallback((value: T) => {
    if ("scheduler" in window && "yield" in window.scheduler) {
      (window.scheduler as any).yield().then(() => setState(value));
    } else if ("requestIdleCallback" in window) {
      requestIdleCallback(() => setState(value), { timeout: 1000 });
    } else {
      setTimeout(() => setState(value), 0);
    }
  }, []);

  return [state, deferredSetState];
}

/**
 * PERF: Debounced state hook to reduce update frequency
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
): [T, (value: T) => void] {
  const [state, setState] = useDeferredState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setDebouncedState = useCallback(
    (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setState(value);
      }, delay);
    },
    [setState, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, setDebouncedState];
}

/**
 * PERF: Throttled state hook to limit update frequency
 */
export function useThrottledState<T>(
  initialValue: T,
  interval: number = 100
): [T, (value: T) => void] {
  const [state, setState] = useDeferredState(initialValue);
  const lastUpdateRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setThrottledState = useCallback(
    (value: T) => {
      const now = Date.now();

      if (now - lastUpdateRef.current >= interval) {
        lastUpdateRef.current = now;
        setState(value);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastUpdateRef.current = Date.now();
          setState(value);
        }, interval - (now - lastUpdateRef.current));
      }
    },
    [setState, interval]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, setThrottledState];
}

/**
 * PERF: Monitor component render time
 * Logs warnings if component takes too long to render (>50ms)
 */
export function useRenderTime(componentName: string, threshold: number = 50) {
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = performance.now();

    return () => {
      const duration = performance.now() - startTimeRef.current;
      if (duration > threshold) {
        console.warn(
          `[PERF] ${componentName} render took ${duration.toFixed(2)}ms`
        );
      }
    };
  });
}

/**
 * PERF: Intersection Observer hook for visibility detection
 * Useful for lazy loading images, infinite scroll, etc.
 */
export function useIntersectionObserver<T extends Element>(
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      callback(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [callback, options]);

  return elementRef;
}

/**
 * PERF: Debounced callback hook
 * Prevents function calls during rapid changes
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * PERF: Memoized expensive computation hook
 * Prevents recalculation on every render
 */
export function useMemoComputation<T>(
  computation: () => T,
  dependencies: React.DependencyList
): T {
  return useMemo(computation, dependencies);
}

/**
 * PERF: Detect if element is in viewport
 * Useful for virtualization and lazy loading
 */
export function useIsInViewport<T extends Element>(): [
  React.RefObject<T>,
  boolean
] {
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useDeferredState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "100px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [setIsVisible]);

  return [elementRef, isVisible];
}

/**
 * PERF: Request Animation Frame hook for smooth animations
 */
export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const tick = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }
      const deltaTime = currentTime - lastTimeRef.current;
      callback(deltaTime);
      lastTimeRef.current = currentTime;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [callback]);
}

/**
 * PERF: Resource loader hook for dynamic imports
 * Helps split code and reduce initial bundle size
 */
export function useAsyncResource<T>(
  asyncFunc: () => Promise<T>,
  dependencies: React.DependencyList
): T | null {
  const [resource, setResource] = useDeferredState<T | null>(null);

  useEffect(() => {
    let isMounted = true;

    asyncFunc().then((data) => {
      if (isMounted) {
        setResource(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return resource;
}

export default {
  useDeferredState,
  useDebouncedState,
  useThrottledState,
  useRenderTime,
  useIntersectionObserver,
  useDebouncedCallback,
  useMemoComputation,
  useIsInViewport,
  useAnimationFrame,
  useAsyncResource,
};
