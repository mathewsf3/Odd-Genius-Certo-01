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

import { NextFunction, Request, Response } from 'express';
import { DefaultService } from '../apis/footy';
import { logger } from '../utils/logger';

const API_KEY = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756';

export class TeamController {

  /**
   * GET /api/v1/teams/:id
   * Get detailed information for a specific team
   */
  async getTeamById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teamId = parseInt(req.params.id);
      
      if (isNaN(teamId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid team ID format'
        });
        return;
      }

      logger.info(`🏟️ Getting team info for ${teamId}`);
      
      const teamData = await DefaultService.getTeam(teamId, API_KEY);

      res.json({
        success: true,
        data: teamData,
        message: `Team ${teamId} information retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting team ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/teams/:id/stats
   * Get recent performance statistics for a team
   */
  async getTeamStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teamId = parseInt(req.params.id);
      const lastX = parseInt(req.query.lastX as string) || 5;
      
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

      logger.info(`📊 Getting last ${lastX} stats for team ${teamId}`);
      
      const statsData = await DefaultService.getTeamLastXStats(teamId, API_KEY);

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

    } catch (error) {
      logger.error(`Error getting team stats for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/teams/search
   * Search teams (placeholder for future implementation)
   */
  async searchTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, league, country } = req.query;

      logger.info('🔍 Searching teams with criteria:', { name, league, country });

      res.json({
        success: true,
        data: {
          teams: [],
          totalResults: 0,
          searchCriteria: { name, league, country }
        },
        message: 'Team search functionality coming soon'
      });

    } catch (error) {
      logger.error('Error searching teams:', error);
      next(error);
    }
  }
}

export default new TeamController();
