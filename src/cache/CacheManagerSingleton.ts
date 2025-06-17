/**
 * 🔄 CACHE MANAGER SINGLETON
 * 
 * Provides a shared CacheManager instance across all analytics services
 * to improve memory efficiency and cache hit rates
 */

import { CacheManager } from './CacheManager';

export class CacheManagerSingleton {
  private static instance: CacheManager | null = null;
  private static isInitialized = false;

  /**
   * Get the shared CacheManager instance
   */
  public static getInstance(): CacheManager {
    if (!CacheManagerSingleton.instance) {
      CacheManagerSingleton.instance = new CacheManager({
        defaultTtl: 1800, // 30 minutes default
        maxMemoryUsage: 100 * 1024 * 1024, // 100MB
        cleanupIntervalMs: 300000 // 5 minutes
      });
      CacheManagerSingleton.isInitialized = true;
      console.log('🔄 CacheManager singleton initialized');
    }
    return CacheManagerSingleton.instance;
  }

  /**
   * Initialize with custom configuration
   */
  public static initialize(config: {
    defaultTtl?: number;
    maxMemoryUsage?: number;
    cleanupIntervalMs?: number;
  }): CacheManager {
    if (CacheManagerSingleton.isInitialized) {
      console.warn('⚠️ CacheManager singleton already initialized, ignoring new config');
      return CacheManagerSingleton.instance!;
    }

    CacheManagerSingleton.instance = new CacheManager({
      defaultTtl: config.defaultTtl || 1800,
      maxMemoryUsage: config.maxMemoryUsage || 100 * 1024 * 1024,
      cleanupIntervalMs: config.cleanupIntervalMs || 300000
    });
    CacheManagerSingleton.isInitialized = true;
    console.log('🔄 CacheManager singleton initialized with custom config');
    return CacheManagerSingleton.instance;
  }

  /**
   * Reset the singleton (for testing purposes)
   */
  public static reset(): void {
    if (CacheManagerSingleton.instance) {
      CacheManagerSingleton.instance.shutdown();
    }
    CacheManagerSingleton.instance = null;
    CacheManagerSingleton.isInitialized = false;
    console.log('🔄 CacheManager singleton reset');
  }

  /**
   * Check if singleton is initialized
   */
  public static isReady(): boolean {
    return CacheManagerSingleton.isInitialized && CacheManagerSingleton.instance !== null;
  }

  /**
   * Shutdown the singleton
   */
  public static async shutdown(): Promise<void> {
    if (CacheManagerSingleton.instance) {
      await CacheManagerSingleton.instance.clear();
      CacheManagerSingleton.instance.shutdown();
      CacheManagerSingleton.instance = null;
      CacheManagerSingleton.isInitialized = false;
      console.log('🔄 CacheManager singleton shutdown complete');
    }
  }
}
