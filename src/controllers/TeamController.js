"use strict";
/**
 * 🏟️ Team Controller
 *
 * Express.js controller for team-related endpoints
 * Integrates with FootyStats API for comprehensive team data
 *
 * Features:
 * - Team information and statistics
 * - Recent team performance
 * - Team-based analytics
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
exports.TeamController = void 0;
const footy_1 = require("../apis/footy");
const logger_1 = require("../utils/logger");
const API_KEY = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756';
class TeamController {
    /**
     * GET /api/v1/teams/:id
     * Get detailed information for a specific team
     */
    getTeamById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamId = parseInt(req.params.id);
                if (isNaN(teamId)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid team ID format'
                    });
                    return;
                }
                logger_1.logger.info(`🏟️ Getting team info for ${teamId}`);
                const teamData = yield footy_1.DefaultService.getTeam(teamId, API_KEY);
                res.json({
                    success: true,
                    data: teamData,
                    message: `Team ${teamId} information retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting team ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/teams/:id/stats
     * Get recent performance statistics for a team
     */
    getTeamStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamId = parseInt(req.params.id);
                const lastX = parseInt(req.query.lastX) || 5;
                if (isNaN(teamId)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid team ID format'
                    });
                    return;
                }
                if (![5, 6, 10].includes(lastX)) {
                    res.status(400).json({
                        success: false,
                        message: 'lastX parameter must be 5, 6, or 10'
                    });
                    return;
                }
                logger_1.logger.info(`📊 Getting last ${lastX} stats for team ${teamId}`);
                const statsData = yield footy_1.DefaultService.getTeamLastXStats(teamId, API_KEY);
                res.json({
                    success: true,
                    data: statsData,
                    metadata: {
                        teamId,
                        lastXMatches: lastX,
                        timestamp: new Date().toISOString()
                    },
                    message: `Last ${lastX} statistics for team ${teamId} retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting team stats for ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/teams/search
     * Search teams (placeholder for future implementation)
     */
    searchTeams(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, league, country } = req.query;
                logger_1.logger.info('🔍 Searching teams with criteria:', { name, league, country });
                res.json({
                    success: true,
                    data: {
                        teams: [],
                        totalResults: 0,
                        searchCriteria: { name, league, country }
                    },
                    message: 'Team search functionality coming soon'
                });
            }
            catch (error) {
                logger_1.logger.error('Error searching teams:', error);
                next(error);
            }
        });
    }
}
exports.TeamController = TeamController;
exports.default = new TeamController();
