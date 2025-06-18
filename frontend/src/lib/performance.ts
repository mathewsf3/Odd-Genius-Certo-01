/**
 * 🎯 Performance Monitoring Utilities
 * 
 * Provides performance monitoring and analytics for the football dashboard
 * Tracks Core Web Vitals, API response times, and user interactions
 */

// Performance metrics interface
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url?: string;
  userAgent?: string;
}

// Core Web Vitals interface
interface WebVital {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Track a custom performance metric
   */
  trackMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };

    this.metrics.push(metric);

    // Log in development
    if (!this.isProduction) {
      console.log(`📊 Performance Metric: ${name}`, {
        value: `${value}ms`,
        metadata,
      });
    }

    // Send to analytics in production
    if (this.isProduction) {
      this.sendToAnalytics(metric, metadata);
    }
  }

  /**
   * Track API response time
   */
  trackAPICall(endpoint: string, duration: number, status: number) {
    this.trackMetric('api_call', duration, {
      endpoint,
      status,
      success: status >= 200 && status < 300,
    });
  }

  /**
   * Track page load time
   */
  trackPageLoad(pageName: string) {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.trackMetric('page_load', loadTime, { page: pageName });
    }
  }

  /**
   * Track component render time
   */
  trackComponentRender(componentName: string, renderTime: number) {
    this.trackMetric('component_render', renderTime, {
      component: componentName,
    });
  }

  /**
   * Track user interaction
   */
  trackInteraction(action: string, element: string, duration?: number) {
    this.trackMetric('user_interaction', duration || 0, {
      action,
      element,
    });
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const summary = {
      totalMetrics: this.metrics.length,
      averageAPITime: this.getAverageMetric('api_call'),
      averagePageLoad: this.getAverageMetric('page_load'),
      averageComponentRender: this.getAverageMetric('component_render'),
      slowestAPI: this.getSlowestMetric('api_call'),
      slowestPageLoad: this.getSlowestMetric('page_load'),
    };

    if (!this.isProduction) {
      console.table(summary);
    }

    return summary;
  }

  /**
   * Clear metrics (useful for testing)
   */
  clearMetrics() {
    this.metrics = [];
  }

  private getAverageMetric(name: string): number {
    const metrics = this.metrics.filter(m => m.name === name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  private getSlowestMetric(name: string): PerformanceMetric | null {
    const metrics = this.metrics.filter(m => m.name === name);
    if (metrics.length === 0) return null;
    return metrics.reduce((slowest, current) => 
      current.value > slowest.value ? current : slowest
    );
  }

  private sendToAnalytics(metric: PerformanceMetric, metadata?: Record<string, any>) {
    // In a real application, you would send this to your analytics service
    // For example: Google Analytics, Mixpanel, or custom analytics endpoint
    
    // Example implementation:
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        custom_parameters: metadata,
      });
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for tracking component performance
 */
export function usePerformanceTracking(componentName: string) {
  const trackRender = (renderTime: number) => {
    performanceMonitor.trackComponentRender(componentName, renderTime);
  };

  const trackInteraction = (action: string, element: string, duration?: number) => {
    performanceMonitor.trackInteraction(action, element, duration);
  };

  return { trackRender, trackInteraction };
}

/**
 * Higher-order component for automatic performance tracking
 */
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: P) {
    const startTime = performance.now();

    React.useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      performanceMonitor.trackComponentRender(componentName, renderTime);
    }, []);

    return <WrappedComponent {...props} />;
  };
}

/**
 * Track Core Web Vitals
 */
export function trackWebVitals(metric: WebVital) {
  performanceMonitor.trackMetric(`web_vital_${metric.name}`, metric.value, {
    id: metric.id,
    delta: metric.delta,
    rating: metric.rating,
  });
}

/**
 * API call wrapper with automatic performance tracking
 */
export async function trackAPICall<T>(
  endpoint: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  let status = 0;

  try {
    const result = await apiCall();
    status = 200; // Assume success if no error
    return result;
  } catch (error) {
    status = error instanceof Error && 'status' in error ? (error as any).status : 500;
    throw error;
  } finally {
    const duration = performance.now() - startTime;
    performanceMonitor.trackAPICall(endpoint, duration, status);
  }
}

/**
 * Performance timing decorator for functions
 */
export function measurePerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = performance.now();
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } finally {
        const duration = performance.now() - startTime;
        performanceMonitor.trackMetric(name, duration);
      }
    };

    return descriptor;
  };
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = performanceMonitor;
}
