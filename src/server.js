#!/usr/bin/env node
"use strict";
/**
 * 🚀 Football API Server Entry Point
 *
 * Main server startup file that initializes and starts the application.
 * Handles graceful shutdown and error management.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const processManager_1 = require("./utils/processManager");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
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
            (0, processManager_1.setupProcessHandlers)();
            logger_1.logger.info('🔧 Configuration loaded successfully');
            // Start the server
            const server = app_1.default.listen(config_1.config.port, () => {
                logger_1.logger.info(`🚀 Football Data API Server started`);
                logger_1.logger.info(`📍 Server running on port ${config_1.config.port}`);
                logger_1.logger.info(`🌍 Environment: ${config_1.config.node_env}`);
                logger_1.logger.info(`⚽ FootyStats API configured: ${config_1.config.footyStats.baseUrl}`);
                if (config_1.config.node_env === 'development') {
                    logger_1.logger.info(`🔗 API Endpoints:`);
                    logger_1.logger.info(`   Health: http://localhost:${config_1.config.port}/health`);
                    logger_1.logger.info(`   API v1: http://localhost:${config_1.config.port}/api/v1`);
                    logger_1.logger.info(`   Matches: http://localhost:${config_1.config.port}/api/v1/matches/today`);
                }
            });
            // Handle server errors
            server.on('error', (error) => {
                if (error.syscall !== 'listen') {
                    throw error;
                }
                const bind = typeof config_1.config.port === 'string'
                    ? 'Pipe ' + config_1.config.port
                    : 'Port ' + config_1.config.port;
                switch (error.code) {
                    case 'EACCES':
                        logger_1.logger.error(`${bind} requires elevated privileges`);
                        process.exit(1);
                        break;
                    case 'EADDRINUSE':
                        logger_1.logger.error(`${bind} is already in use`);
                        process.exit(1);
                        break;
                    default:
                        throw error;
                }
            });
            // Graceful shutdown
            const gracefulShutdown = () => {
                logger_1.logger.info('🛑 Received shutdown signal, closing server gracefully...');
                server.close(() => {
                    logger_1.logger.info('✅ Server closed successfully');
                    process.exit(0);
                });
                // Force close after 10 seconds
                setTimeout(() => {
                    logger_1.logger.error('❌ Could not close connections in time, forcefully shutting down');
                    process.exit(1);
                }, 10000);
            };
            process.on('SIGTERM', gracefulShutdown);
            process.on('SIGINT', gracefulShutdown);
        }
        catch (error) {
            logger_1.logger.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    });
}
// Start the server
startServer();
