"use strict";
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
const express_1 = require("express");
const footy_1 = require("../apis/footy");
const environment_1 = require("../config/environment");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
// Simple health check
router.get('/', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = Date.now();
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: environment_1.config.app.nodeEnv,
        version: '1.0.0',
        responseTime: Date.now() - startTime,
    });
})));
// Detailed health check
router.get('/detailed', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = Date.now();
    const healthData = {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: environment_1.config.app.nodeEnv,
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
            const leagues = yield footy_1.DefaultService.getLeagues(environment_1.config.footyStats.apiKey);
            const testDuration = Date.now() - testStartTime;
            healthData.dependencies.footyStatsApi = {
                status: 'healthy',
                responseTime: testDuration,
                lastChecked: new Date().toISOString(),
                endpoint: '/league-list',
                dataReceived: Array.isArray(leagues.data) ? leagues.data.length : 0,
            };
        }
        catch (error) {
            healthData.dependencies.footyStatsApi = {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error',
                lastChecked: new Date().toISOString(),
            };
            healthData.status = 'degraded';
        }
        // Database health (if enabled)
        if (environment_1.config.database.enabled) {
            healthData.dependencies.database = {
                status: 'not_implemented',
                message: 'Database health check not implemented yet',
            };
        }
        // Cache health (if enabled)
        if (environment_1.config.cache.enabled) {
            healthData.dependencies.cache = {
                status: 'healthy',
                type: environment_1.config.cache.strategy,
                message: 'Cache service operational',
            };
        }
        // Overall health assessment
        const unhealthyServices = Object.values(healthData.dependencies)
            .filter((service) => service.status === 'unhealthy').length;
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
    }
    catch (error) {
        logger_1.logger.error('Health check failed:', error);
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            responseTime: Date.now() - startTime,
        });
    }
})));
// Readiness probe (for Kubernetes)
router.get('/ready', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if all critical services are ready
        const isReady = true; // Add actual readiness checks here
        if (isReady) {
            res.json({
                success: true,
                status: 'ready',
                timestamp: new Date().toISOString(),
            });
        }
        else {
            res.status(503).json({
                success: false,
                status: 'not_ready',
                timestamp: new Date().toISOString(),
            });
        }
    }
    catch (error) {
        res.status(503).json({
            success: false,
            status: 'not_ready',
            error: 'Readiness check failed',
            timestamp: new Date().toISOString(),
        });
    }
})));
// Liveness probe (for Kubernetes)
router.get('/live', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Simple liveness check - if we can respond, we're alive
    res.json({
        success: true,
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
})));
// FootyStats API connectivity test
router.get('/footystats', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = Date.now();
    try {
        logger_1.logger.info('Testing FootyStats API connectivity...');
        // Test multiple endpoints
        const tests = [
            {
                name: 'Get Leagues',
                test: () => footy_1.DefaultService.getLeagues(environment_1.config.footyStats.apiKey),
            },
            {
                name: 'Get Countries',
                test: () => footy_1.DefaultService.getCountries(environment_1.config.footyStats.apiKey),
            },
            {
                name: 'Get Today\'s Matches',
                test: () => footy_1.DefaultService.getTodaysMatches(environment_1.config.footyStats.apiKey, undefined, new Date().toISOString().split('T')[0], 1),
            },
        ];
        const results = [];
        for (const test of tests) {
            const testStartTime = Date.now();
            try {
                const result = yield test.test();
                results.push({
                    name: test.name,
                    status: 'success',
                    responseTime: Date.now() - testStartTime,
                    dataReceived: Array.isArray(result.data) ? result.data.length : 'N/A',
                });
            }
            catch (error) {
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
    }
    catch (error) {
        logger_1.logger.error('FootyStats API health check failed:', error);
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            error: 'FootyStats API connectivity test failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            responseTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
        });
    }
})));
// Performance metrics
router.get('/metrics', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
})));
exports.default = router;
