"use strict";
/**
 * 🔄 CACHE MANAGER SINGLETON
 *
 * Provides a shared CacheManager instance across all analytics services
 * to improve memory efficiency and cache hit rates
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManagerSingleton = void 0;
const CacheManager_1 = require("./CacheManager");
class CacheManagerSingleton {
    /**
     * Get the shared CacheManager instance
     */
    static getInstance() {
        if (!CacheManagerSingleton.instance) {
            CacheManagerSingleton.instance = new CacheManager_1.CacheManager({
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
    static initialize(config) {
        if (CacheManagerSingleton.isInitialized) {
            console.warn('⚠️ CacheManager singleton already initialized, ignoring new config');
            return CacheManagerSingleton.instance;
        }
        CacheManagerSingleton.instance = new CacheManager_1.CacheManager({
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
    static reset() {
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
    static isReady() {
        return CacheManagerSingleton.isInitialized && CacheManagerSingleton.instance !== null;
    }
    /**
     * Shutdown the singleton
     */
    static shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            if (CacheManagerSingleton.instance) {
                yield CacheManagerSingleton.instance.clear();
                CacheManagerSingleton.instance.shutdown();
                CacheManagerSingleton.instance = null;
                CacheManagerSingleton.isInitialized = false;
                console.log('🔄 CacheManager singleton shutdown complete');
            }
        });
    }
}
exports.CacheManagerSingleton = CacheManagerSingleton;
CacheManagerSingleton.instance = null;
CacheManagerSingleton.isInitialized = false;
