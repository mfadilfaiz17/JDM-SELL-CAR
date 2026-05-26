/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  fcp?: number; // First Contentful Paint
  dcl?: number; // DOM Content Loaded
  load?: number; // Page Load
}

/**
 * Collect Web Vitals metrics
 */
export function collectWebVitals(): PerformanceMetrics {
  const metrics: PerformanceMetrics = {};

  // Get navigation timing
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const navigation = window.performance.navigation;

    // Time to First Byte
    if (timing.responseStart > 0 && timing.fetchStart > 0) {
      metrics.ttfb = timing.responseStart - timing.fetchStart;
    }

    // First Contentful Paint
    if (timing.domContentLoadedEventEnd > 0 && timing.fetchStart > 0) {
      metrics.fcp = timing.domContentLoadedEventEnd - timing.fetchStart;
    }

    // DOM Content Loaded
    if (timing.domContentLoadedEventEnd > 0 && timing.navigationStart > 0) {
      metrics.dcl = timing.domContentLoadedEventEnd - timing.navigationStart;
    }

    // Page Load
    if (timing.loadEventEnd > 0 && timing.navigationStart > 0) {
      metrics.load = timing.loadEventEnd - timing.navigationStart;
    }
  }

  // Get Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime || 0);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }

  return metrics;
}

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
}

/**
 * Measure async function execution time
 */
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
}

/**
 * Report metrics to analytics service
 */
export function reportMetrics(metrics: PerformanceMetrics): void {
  // This would typically send metrics to an analytics service
  // For now, just log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Metrics]', metrics);
  }

  // Example: Send to analytics service
  // fetch('/api/metrics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(metrics),
  // });
}

/**
 * Get memory usage (if available)
 */
export function getMemoryUsage(): {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
} {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }
  return {};
}

/**
 * Log performance metrics on page load
 */
export function logPerformanceMetrics(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const metrics = collectWebVitals();
    const memory = getMemoryUsage();

    console.group('[Performance Report]');
    console.table(metrics);
    if (Object.keys(memory).length > 0) {
      console.table(memory);
    }
    console.groupEnd();

    reportMetrics(metrics);
  });
}
