/**
 * 🚀 Football Data API - Main Application Setup
 * 
 * Comprehensive Express.js application with:
 * - FootyStats API integration
 * - Type-safe routes and middleware
 * - Security and performance optimizations
 * - Comprehensive error handling
 * - Production-ready configuration
 */

import compression from 'compression';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import healthRoutes from './routes/health';
import v1Routes from './routes/v1';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logging';
import { notFoundHandler } from './middleware/notFoundHandler';

// Import configuration
import { config } from './config';

// Import FootyStats API configuration
import { OpenAPI } from './apis/footy';

class App {
  public app: Application;

  constructor() {
    console.log('🚀 APP.TS CONSTRUCTOR CALLED - CORS FIX ACTIVE!');
    this.app = express();
    this.configureFootyStatsAPI();
    this.setMiddleware();
    this.setRoutes();
    this.setErrorHandling();
  }

  private configureFootyStatsAPI(): void {
    // Configure the FootyStats API client
    OpenAPI.BASE = config.footyStats.baseUrl;
    OpenAPI.TOKEN = config.footyStats.apiKey;
    
    console.log('✅ FootyStats API client configured');
  }

  private setMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration - EXPLICIT SETUP FOR DEVELOPMENT
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'];
    console.log('🔍 CORS Configuration:', {
      allowedOrigins: allowedOrigins,
      nodeEnv: config.app.nodeEnv
    });

    this.app.use(cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'Accept', 'Origin', 'X-Requested-With'],
      exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
      preflightContinue: false,
      optionsSuccessStatus: 200
    }));

    // Compression middleware
    this.app.use(compression());

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    if (config.app.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Custom request logger
    this.app.use(requestLogger);

    // Global rate limiting
    const globalRateLimit = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: config.rateLimit.global.max, // requests per window
      message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,      // Custom key generator for potential API key identification
      keyGenerator: (req: Request) => {
        const apiKey = req.headers['x-api-key'] as string;
        return apiKey ? `api_${apiKey}` : (req.ip || 'unknown');
      }
    });

    this.app.use(globalRateLimit);

    console.log('✅ Middleware configured');
  }

  private setRoutes(): void {
    // API routes
    this.app.use('/health', healthRoutes);
    this.app.use('/api/v1', v1Routes);

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Football Data API - Backend Server',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          api: '/api/v1',
          documentation: '/api/v1/docs'
        },
        timestamp: new Date().toISOString(),
        environment: config.app.nodeEnv
      });
    });

    console.log('✅ Routes configured');
  }

  private setErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);

    // Uncaught exception handler
    process.on('uncaughtException', (error: Error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    // Unhandled promise rejection handler
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    console.log('✅ Error handling configured');
  }

  public getApp(): Application {
    return this.app;
  }
}

export default new App().getApp();
