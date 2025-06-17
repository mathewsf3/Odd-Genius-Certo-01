/**
 * COMMON SERVICE TYPES
 * Shared types and interfaces for all services
 */

import { ServiceResponse, StandardizedResponse } from '../../models';

/**
 * Base configuration for all services
 */
export interface ServiceConfig {
  /** API base URL */
  baseUrl: string;
  /** API key for authentication */
  apiKey: string;
  /** Default timeout for requests (ms) */
  timeout: number;
  /** Maximum retry attempts */
  maxRetries: number;
  /** Enable request/response logging */
  enableLogging: boolean;
  /** Cache configuration */
  cache: {
    enabled: boolean;
    defaultTtl: number;
  };
}

/**
 * Request options for service methods
 */
export interface RequestOptions {
  /** Override default timeout */
  timeout?: number;
  /** Skip cache for this request */
  skipCache?: boolean;
  /** Custom cache TTL for this request */
  cacheTtl?: number;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Request metadata */
  metadata?: Record<string, any>;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  /** Items per page */
  maxPerPage?: number;
  /** Maximum items to return */
  maxItems?: number;
}

/**
 * Common query parameters
 */
export interface CommonParams {
  /** Maximum time for data freshness */
  maxTime?: number;
  /** Include additional statistics */
  includeStats?: boolean;
  /** Timezone for date operations */
  timezone?: string;
}

/**
 * Service method context
 */
export interface ServiceContext {
  /** Method name being executed */
  method: string;
  /** Request parameters */
  params: Record<string, any>;
  /** Request timestamp */
  timestamp: Date;
  /** Unique request ID */
  requestId: string;
  /** Cache key for this request */
  cacheKey?: string;
}

/**
 * Cache strategy options
 */
export interface CacheStrategy {
  /** Cache TTL in seconds */
  ttl: number;
  /** Cache tags for invalidation */
  tags: string[];
  /** Whether to use stale data while revalidating */
  staleWhileRevalidate?: boolean;
  /** Maximum stale age in seconds */
  maxStaleAge?: number;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  /** Requests per minute */
  requestsPerMinute: number;
  /** Burst allowance */
  burstLimit: number;
  /** Rate limit window in seconds */
  windowSize: number;
}

/**
 * Service metrics
 */
export interface ServiceMetrics {
  /** Total requests made */
  totalRequests: number;
  /** Successful requests */
  successfulRequests: number;
  /** Failed requests */
  failedRequests: number;
  /** Cache hits */
  cacheHits: number;
  /** Cache misses */
  cacheMisses: number;
  /** Average response time (ms) */
  averageResponseTime: number;
  /** Last request timestamp */
  lastRequestTime: Date;
}

/**
 * Service health status
 */
export interface ServiceHealth {
  /** Service status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Last health check */
  lastCheck: Date;
  /** Response time for health check */
  responseTime: number;
  /** Error message if unhealthy */
  error?: string;
  /** Service metrics */
  metrics: ServiceMetrics;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Response data */
  data: T;
  /** HTTP status code */
  status: number;
  /** Response headers */
  headers: Record<string, string>;
  /** Response metadata */
  metadata: {
    /** Request duration */
    duration: number;
    /** Whether data came from cache */
    fromCache: boolean;
    /** API rate limit remaining */
    rateLimitRemaining?: number;
    /** API rate limit reset time */
    rateLimitReset?: Date;
  };
}

/**
 * Error context for debugging
 */
export interface ErrorContext {
  /** Service method that failed */
  method: string;
  /** Request parameters */
  params: Record<string, any>;
  /** HTTP status code */
  statusCode?: number;
  /** Original error message */
  originalError: string;
  /** Request ID for tracing */
  requestId: string;
  /** Timestamp of error */
  timestamp: Date;
}

/**
 * Service event types
 */
export type ServiceEvent = 
  | 'request:start'
  | 'request:success'
  | 'request:error'
  | 'cache:hit'
  | 'cache:miss'
  | 'rate_limit:exceeded'
  | 'health:check';

/**
 * Service event data
 */
export interface ServiceEventData {
  /** Event type */
  event: ServiceEvent;
  /** Service context */
  context: ServiceContext;
  /** Event-specific data */
  data?: any;
  /** Event timestamp */
  timestamp: Date;
}

/**
 * Base service interface
 */
export interface IBaseService {
  /** Service configuration */
  readonly config: ServiceConfig;
  
  /** Service health status */
  getHealth(): Promise<ServiceHealth>;
  
  /** Service metrics */
  getMetrics(): ServiceMetrics;
  
  /** Reset service metrics */
  resetMetrics(): void;
  
  /** Shutdown service and cleanup resources */
  shutdown(): Promise<void>;
}
