#!/usr/bin/env node

// Force recompilation - debug match analysis v7 - TRY BLOCK DEBUG
/**
 * 🚀 Football API Server Entry Point
 * 
 * Main server startup file that initializes and starts the application.
 * Handles graceful shutdown and error management.
 */

import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { setupProcessHandlers } from './utils/processManager';

async function startServer(): Promise<void> {
    try {
        // ASCII Banner
        console.log(`
🚀 Football Data API Backend Server
=============================================
📊 Complete FootyStats Integration
⚽ Advanced Football Analytics
🔒 Production-Ready Security
🎯 TypeScript + OpenAPI Generated Client
=============================================
        `);

        // Setup process handlers for graceful shutdown
        setupProcessHandlers();

        logger.info('🔧 Configuration loaded successfully');

        // Start the server
        const server = app.listen(config.port, () => {
            logger.info(`🚀 Football Data API Server started`);
            logger.info(`📍 Server running on port ${config.port}`);
            logger.info(`🌍 Environment: ${config.node_env}`);
            logger.info(`⚽ FootyStats API configured: ${config.footyStats.baseUrl}`);
            
            if (config.node_env === 'development') {
                logger.info(`🔗 API Endpoints:`);
                logger.info(`   Health: http://localhost:${config.port}/health`);
                logger.info(`   API v1: http://localhost:${config.port}/api/v1`);
                logger.info(`   Matches: http://localhost:${config.port}/api/v1/matches/today`);
            }
        });

        // Handle server errors
        server.on('error', (error: any) => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            const bind = typeof config.port === 'string' 
                ? 'Pipe ' + config.port 
                : 'Port ' + config.port;

            switch (error.code) {
                case 'EACCES':
                    logger.error(`${bind} requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    logger.error(`${bind} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

        // Graceful shutdown
        const gracefulShutdown = () => {
            logger.info('🛑 Received shutdown signal, closing server gracefully...');
            
            server.close(() => {
                logger.info('✅ Server closed successfully');
                process.exit(0);
            });

            // Force close after 10 seconds
            setTimeout(() => {
                logger.error('❌ Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
