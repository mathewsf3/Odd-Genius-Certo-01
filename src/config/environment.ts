/**
 * 🔧 Environment Configuration
 * 
 * Centralized configuration management for the Football API backend.
 * Validates environment variables and provides type-safe configuration.
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper functions for type coercion and defaults
const coerceNumber = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const coerceBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

const getString = (value: string | undefined, defaultValue: string): string => {
  return value || defaultValue;
};

const getOptionalString = (value: string | undefined): string | undefined => {
  return value || undefined;
};

const getStringArray = (value: string | undefined, defaultValue: string[]): string[] => {
  if (!value) return defaultValue;
  return value.split(',').map(s => s.trim());
};

// Parse and validate configuration
export const config = {
  app: {
    nodeEnv: getString(process.env.NODE_ENV, 'development') as 'development' | 'production' | 'test',
    port: coerceNumber(process.env.PORT, 3000),
    apiVersion: getString(process.env.API_VERSION, 'v1'),
  },
  footyStats: {
    baseUrl: getString(process.env.FOOTYSTATS_BASE_URL, 'https://api.football-data-api.com'),
    apiKey: getString(process.env.FOOTYSTATS_API_KEY, '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756'),
    timeout: coerceNumber(process.env.FOOTYSTATS_TIMEOUT, 30000),
    retryAttempts: coerceNumber(process.env.FOOTYSTATS_RETRY_ATTEMPTS, 3),
    retryDelay: coerceNumber(process.env.FOOTYSTATS_RETRY_DELAY, 1000),
  },
  database: {
    enabled: coerceBoolean(process.env.DATABASE_ENABLED, false),
    host: getOptionalString(process.env.DATABASE_HOST),
    port: process.env.DATABASE_PORT ? coerceNumber(process.env.DATABASE_PORT, 5432) : undefined,
    name: getOptionalString(process.env.DATABASE_NAME),
    username: getOptionalString(process.env.DATABASE_USERNAME),
    password: getOptionalString(process.env.DATABASE_PASSWORD),
    ssl: coerceBoolean(process.env.DATABASE_SSL, false),
    maxConnections: coerceNumber(process.env.DATABASE_MAX_CONNECTIONS, 10),
  },
  redis: {
    enabled: coerceBoolean(process.env.REDIS_ENABLED, false),
    host: getString(process.env.REDIS_HOST, 'localhost'),
    port: coerceNumber(process.env.REDIS_PORT, 6379),
    password: getOptionalString(process.env.REDIS_PASSWORD),
    db: coerceNumber(process.env.REDIS_DB, 0),
    keyPrefix: getString(process.env.REDIS_KEY_PREFIX, 'football_api:'),
    ttl: coerceNumber(process.env.REDIS_TTL, 3600),
  },
  security: {
    enabled: coerceBoolean(process.env.SECURITY_ENABLED, true),
    jwtSecret: getOptionalString(process.env.JWT_SECRET),
    bcryptRounds: coerceNumber(process.env.BCRYPT_ROUNDS, 12),
    sessionSecret: getOptionalString(process.env.SESSION_SECRET),
  },
  cors: {
    allowedOrigins: getStringArray(process.env.CORS_ALLOWED_ORIGINS, ['http://localhost:3000', 'http://localhost:3001']),
    credentials: coerceBoolean(process.env.CORS_CREDENTIALS, true),
  },
  rateLimit: {
    global: {
      max: coerceNumber(process.env.RATE_LIMIT_GLOBAL_MAX, 1000),
      windowMs: coerceNumber(process.env.RATE_LIMIT_GLOBAL_WINDOW, 15 * 60 * 1000),
    },
    api: {
      max: coerceNumber(process.env.RATE_LIMIT_API_MAX, 100),
      windowMs: coerceNumber(process.env.RATE_LIMIT_API_WINDOW, 15 * 60 * 1000),
    },
    analytics: {
      max: coerceNumber(process.env.RATE_LIMIT_ANALYTICS_MAX, 50),
      windowMs: coerceNumber(process.env.RATE_LIMIT_ANALYTICS_WINDOW, 15 * 60 * 1000),
    },
  },
  logging: {
    level: getString(process.env.LOG_LEVEL, 'info') as 'error' | 'warn' | 'info' | 'debug',
    format: getString(process.env.LOG_FORMAT, 'json') as 'json' | 'simple',
    file: {
      enabled: coerceBoolean(process.env.LOG_FILE_ENABLED, true),
      path: getString(process.env.LOG_FILE_PATH, './logs'),
      maxSize: getString(process.env.LOG_FILE_MAX_SIZE, '20m'),
      maxFiles: coerceNumber(process.env.LOG_FILE_MAX_FILES, 5),
    },
  },
  cache: {
    enabled: coerceBoolean(process.env.CACHE_ENABLED, true),
    defaultTtl: coerceNumber(process.env.CACHE_DEFAULT_TTL, 3600),
    maxSize: coerceNumber(process.env.CACHE_MAX_SIZE, 1000),
    strategy: getString(process.env.CACHE_STRATEGY, 'memory') as 'memory' | 'redis',
  },
};

// Export individual config sections for convenience
export const {
  app: appConfig,
  footyStats: footyStatsConfig,
  database: databaseConfig,
  redis: redisConfig,
  security: securityConfig,
  cors: corsConfig,
  rateLimit: rateLimitConfig,
  logging: loggingConfig,
  cache: cacheConfig,
} = config;

// Configuration validation function
export function validateConfiguration(): void {
  try {
    // Basic validation - check required fields
    if (!config.footyStats.apiKey) {
      throw new Error('FootyStats API key is required');
    }
    console.log('✅ Configuration validation successful');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    throw new Error('Invalid configuration');
  }
}

// Environment checker
export const isDevelopment = () => config.app.nodeEnv === 'development';
export const isProduction = () => config.app.nodeEnv === 'production';
export const isTest = () => config.app.nodeEnv === 'test';

export default config;
