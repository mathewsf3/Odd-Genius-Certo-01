/**
 * 🚀 REQUEST DEDUPLICATION SERVICE
 * 
 * Prevents multiple simultaneous API calls for the same data
 * Critical for avoiding rate limiting during development
 */

export class RequestDeduplicationService {
  private static instance: RequestDeduplicationService;
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private requestCounts: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): RequestDeduplicationService {
    if (!RequestDeduplicationService.instance) {
      RequestDeduplicationService.instance = new RequestDeduplicationService();
    }
    return RequestDeduplicationService.instance;
  }

  /**
   * Execute a request with deduplication
   * If the same request is already in progress, return the existing promise
   */
  async executeRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    options: {
      timeout?: number;
      logDuplicates?: boolean;
    } = {}
  ): Promise<T> {
    const { timeout = 30000, logDuplicates = true } = options;

    // Check if request is already in progress
    if (this.pendingRequests.has(key)) {
      const count = this.requestCounts.get(key) || 0;
      this.requestCounts.set(key, count + 1);
      
      if (logDuplicates) {
        console.log(`🔄 Deduplicating request: ${key} (${count + 1} duplicate calls prevented)`);
      }
      
      return this.pendingRequests.get(key)!;
    }

    // Create new request with timeout
    const requestPromise = Promise.race([
      requestFn(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Request timeout: ${key}`)), timeout)
      )
    ]);

    // Store the promise
    this.pendingRequests.set(key, requestPromise);
    this.requestCounts.set(key, 1);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up
      this.pendingRequests.delete(key);
      const finalCount = this.requestCounts.get(key) || 1;
      this.requestCounts.delete(key);
      
      if (finalCount > 1) {
        console.log(`✅ Request completed: ${key} (prevented ${finalCount - 1} duplicate API calls)`);
      }
    }
  }

  /**
   * Clear all pending requests (useful for testing)
   */
  clearAll(): void {
    this.pendingRequests.clear();
    this.requestCounts.clear();
  }

  /**
   * Get current pending request count
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }

  /**
   * Get statistics about prevented duplicate calls
   */
  getStats(): { pendingRequests: number; totalPrevented: number } {
    const totalPrevented = Array.from(this.requestCounts.values())
      .reduce((sum, count) => sum + (count - 1), 0);
    
    return {
      pendingRequests: this.pendingRequests.size,
      totalPrevented
    };
  }
}

// Export singleton instance
export const requestDeduplication = RequestDeduplicationService.getInstance();
