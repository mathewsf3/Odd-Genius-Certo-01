/**
 * Models Index - Export all DTO types
 * Centralized export for all data type definitions
 */

// Match DTOs
export * from './Match.dto';

// Team DTOs
export * from './Team.dto';

// Player DTOs
export * from './Player.dto';

// League DTOs
export * from './League.dto';

// Referee DTOs
export * from './Referee.dto';

// Analytics DTOs
export * from './Analytics.dto';

// Common response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pager: {
    current_page: number;
    max_page: number;
    results_per_page: number;
    total_results: number;
  };
}

export interface StandardizedResponse<T = any> {
  success: boolean;
  data: T;
  metadata: {
    source: string;
    timestamp: string;
    processingTime?: number;
    endpoint?: string;
  };
  error?: string;
}

// Pagination options
export interface PaginationOptions {
  page?: number;
  limit?: number;
  maxPerPage?: number;
}

// Common request options
export interface RequestOptions {
  includeStats?: boolean;
  includeAnalytics?: boolean;
  season?: string;
  competition?: string;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Cache-related types
export interface CacheOptions {
  ttl?: number;
  key?: string;
  tags?: string[];
}

// Search options
export interface SearchOptions {
  query?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Date range options
export interface DateRangeOptions {
  startDate?: string;
  endDate?: string;
  timezone?: string;
}

// Filter options
export interface FilterOptions {
  country?: string;
  league?: string;
  season?: string;
  status?: string;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Service response wrapper
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: string;
    source: string;
    processingTime?: number;
    cached?: boolean;
  };
}

// Health check types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services: {
    database?: ServiceHealth;
    cache?: ServiceHealth;
    externalApi?: ServiceHealth;
  };
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

// Configuration types
export interface ApiConfiguration {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
  rateLimitPerMinute: number;
}

export interface CacheConfiguration {
  provider: 'redis' | 'memory';
  host?: string;
  port?: number;
  password?: string;
  defaultTtl: number;
  maxMemoryUsage?: number;
}

// Logging types
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  metadata?: any;
  service?: string;
  requestId?: string;
}

// Performance metrics
export interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeConnections: number;
  requestsPerSecond: number;
  errorRate: number;
}

// Rate limiting types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// Authentication types
export interface AuthToken {
  token: string;
  expiresAt: string;
  permissions: string[];
}

export interface UserContext {
  userId?: string;
  permissions: string[];
  rateLimits: RateLimitInfo;
}

// Webhook types
export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature: string;
}

// Batch operation types
export interface BatchRequest<T> {
  items: T[];
  options?: {
    continueOnError?: boolean;
    maxConcurrency?: number;
  };
}

export interface BatchResponse<T> {
  success: boolean;
  results: BatchResult<T>[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface BatchResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  index: number;
}
