"use strict";
/**
 * 🎯 Main Configuration
 * Environment variables and application configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env = process.env;
exports.config = {
    node_env: env.NODE_ENV || 'development',
    port: parseInt(env.PORT || '3000'),
    footyStats: {
        apiKey: env.FOOTY_STATS_API_KEY || '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
        baseUrl: env.FOOTY_STATS_BASE_URL || 'https://api.football-data-api.com',
    },
    cors: {
        origin: env.NODE_ENV === 'production' ? false : true,
        credentials: true,
        allowedOrigins: env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'] : [],
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        global: {
            max: 100
        }
    },
    app: {
        port: parseInt(env.PORT || '3000'),
        nodeEnv: env.NODE_ENV || 'development'
    }
};
