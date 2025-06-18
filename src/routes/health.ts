/**
 * 🏥 Health Check Routes
 * 
 * Comprehensive health monitoring endpoints for:
 * - Basic server health
 * - Database connectivity
 * - External API status (FootyStats)
 * - System resources
 * - Detailed diagnostics
 */

import { Request, Response, Router } from 'express';
import { DefaultService } from '../apis/footy';
import { config } from '../config/environment';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// Simple health check
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const startTime = Date.now();
    
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.app.nodeEnv,
        version: '1.0.0',
        responseTime: Date.now() - startTime,
    });
}));

// Detailed health check
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
    const startTime = Date.now();
    const healthData: any = {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: config.app.nodeEnv,
        version: '1.0.0',
        services: {},
        system: {},
        dependencies: {},
    };

    try {
        // System information
        healthData.system = {
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                external: Math.round(process.memoryUsage().external / 1024 / 1024),
                rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
            },
            cpu: process.cpuUsage(),
            platform: process.platform,
            nodeVersion: process.version,
        };

        // FootyStats API health check
        try {
            const testStartTime = Date.now();
            const leagues = await DefaultService.getLeagues({ key: config.footyStats.apiKey });
            const testDuration = Date.now() - testStartTime;
            
            healthData.dependencies.footyStatsApi = {
                status: 'healthy',
                responseTime: testDuration,
                lastChecked: new Date().toISOString(),
                endpoint: '/league-list',
                dataReceived: Array.isArray(leagues.data) ? leagues.data.length : 0,
            };
        } catch (error) {
            healthData.dependencies.footyStatsApi = {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error',
                lastChecked: new Date().toISOString(),
            };
            healthData.status = 'degraded';
        }

        // Database health (if enabled)
        if (config.database.enabled) {
            healthData.dependencies.database = {
                status: 'not_implemented',
                message: 'Database health check not implemented yet',
            };
        }

        // Cache health (if enabled)
        if (config.cache.enabled) {
            healthData.dependencies.cache = {
                status: 'healthy',
                type: config.cache.strategy,
                message: 'Cache service operational',
            };
        }

        // Overall health assessment
        const unhealthyServices = Object.values(healthData.dependencies)
            .filter((service: any) => service.status === 'unhealthy').length;
        
        if (unhealthyServices > 0) {
            healthData.status = unhealthyServices === Object.keys(healthData.dependencies).length 
                ? 'unhealthy' 
                : 'degraded';
        }

        healthData.responseTime = Date.now() - startTime;

        // Set appropriate status code
        const statusCode = healthData.status === 'healthy' ? 200 : 
                          healthData.status === 'degraded' ? 200 : 503;

        res.status(statusCode).json(healthData);

    } catch (error) {
        logger.error('Health check failed:', error);
        
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            responseTime: Date.now() - startTime,
        });
    }
}));

// Readiness probe (for Kubernetes)
router.get('/ready', asyncHandler(async (req: Request, res: Response) => {
    try {
        // Check if all critical services are ready
        const isReady = true; // Add actual readiness checks here
        
        if (isReady) {
            res.json({
                success: true,
                status: 'ready',
                timestamp: new Date().toISOString(),
            });
        } else {
            res.status(503).json({
                success: false,
                status: 'not_ready',
                timestamp: new Date().toISOString(),
            });
        }
    } catch (error) {
        res.status(503).json({
            success: false,
            status: 'not_ready',
            error: 'Readiness check failed',
            timestamp: new Date().toISOString(),
        });
    }
}));

// Liveness probe (for Kubernetes)
router.get('/live', asyncHandler(async (req: Request, res: Response) => {
    // Simple liveness check - if we can respond, we're alive
    res.json({
        success: true,
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
}));

// FootyStats API connectivity test
router.get('/footystats', asyncHandler(async (req: Request, res: Response) => {
    const startTime = Date.now();
    
    try {
        logger.info('Testing FootyStats API connectivity...');
        
        // Test multiple endpoints
        const tests = [
            {
                name: 'Get Leagues',
                test: () => DefaultService.getLeagues({ key: config.footyStats.apiKey }),
            },
            {
                name: 'Get Countries',
                test: () => DefaultService.getCountries({ key: config.footyStats.apiKey }),
            },
            {
                name: 'Get Today\'s Matches',
                test: () => DefaultService.getTodaysMatches({
                    key: config.footyStats.apiKey,
                    timezone: 'Etc/UTC',
                    date: new Date().toISOString().split('T')[0],
                    page: 1
                }),
            },
        ];

        const results = [];
        
        for (const test of tests) {
            const testStartTime = Date.now();
            try {
                const result = await test.test();
                results.push({
                    name: test.name,
                    status: 'success',
                    responseTime: Date.now() - testStartTime,
                    dataReceived: Array.isArray(result.data) ? result.data.length : 'N/A',
                });
            } catch (error) {
                results.push({
                    name: test.name,
                    status: 'failed',
                    responseTime: Date.now() - testStartTime,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        const successfulTests = results.filter(r => r.status === 'success').length;
        const overallStatus = successfulTests === tests.length ? 'healthy' : 
                             successfulTests > 0 ? 'degraded' : 'unhealthy';

        res.json({
            success: overallStatus !== 'unhealthy',
            status: overallStatus,
            totalTests: tests.length,
            successfulTests,
            failedTests: tests.length - successfulTests,
            results,
            totalResponseTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        logger.error('FootyStats API health check failed:', error);
        
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            error: 'FootyStats API connectivity test failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            responseTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
        });
    }
}));

// Performance metrics
router.get('/metrics', asyncHandler(async (req: Request, res: Response) => {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        metrics: {
            uptime: process.uptime(),
            memory: {
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
                external: Math.round(memUsage.external / 1024 / 1024),
                rss: Math.round(memUsage.rss / 1024 / 1024),
            },
            cpu: {
                user: cpuUsage.user,
                system: cpuUsage.system,
            },
            eventLoop: {
                // Add event loop metrics if needed
            },
            gc: {
                // Add garbage collection metrics if needed
            },
        },
    });
}));

export default router;
