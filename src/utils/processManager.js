"use strict";
/**
 * 🗂️ Process Management Utilities
 * Handles graceful shutdown and process signals
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupProcessHandlers = void 0;
const setupProcessHandlers = () => {
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
        console.log('🛑 SIGTERM received, shutting down gracefully');
        process.exit(0);
    });
    process.on('SIGINT', () => {
        console.log('🛑 SIGINT received, shutting down gracefully');
        process.exit(0);
    });
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('💥 Uncaught Exception:', error);
        process.exit(1);
    });
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
};
exports.setupProcessHandlers = setupProcessHandlers;
