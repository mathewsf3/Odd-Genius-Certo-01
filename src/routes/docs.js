"use strict";
/**
 * 📚 Documentation Routes
 * API documentation endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Football Data API Documentation',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api/v1',
            docs: '/docs'
        }
    });
});
exports.default = router;
