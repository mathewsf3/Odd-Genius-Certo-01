"use strict";
/**
 * 🚫 Not Found Handler
 * Handles 404 errors for unmatched routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        error: 'NOT_FOUND'
    });
};
exports.notFoundHandler = notFoundHandler;
