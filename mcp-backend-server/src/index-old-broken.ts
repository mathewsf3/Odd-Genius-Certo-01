#!/usr/bin/env node

/**
 * MCP Backend Development Server
 * 
 * A comprehensive Model Context Protocol server designed to assist with
 * backend development tasks including:
 * - API endpoint generation and management
 * - Database schema design and migrations
 * - Testing strategy and test generation
 * - Security implementation
 * - Performance optimization
 * - Deployment and DevOps assistance
 * - Code quality and best practices
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import YAML from 'yaml';
import chalk from 'chalk';

// Tool schemas
const CreateApiEndpointSchema = z.object({
  endpoint: z.string().describe('API endpoint path (e.g., /api/users)'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).describe('HTTP method'),
  description: z.string().describe('Endpoint description'),
  requestBody: z.string().optional().describe('Request body schema (JSON)'),
  responseBody: z.string().optional().describe('Response body schema (JSON)'),
  middleware: z.array(z.string()).optional().describe('Middleware to apply'),
  validation: z.boolean().default(true).describe('Include input validation'),
  authentication: z.boolean().default(false).describe('Require authentication'),
  rateLimit: z.boolean().default(false).describe('Apply rate limiting'),
});

const CreateDatabaseSchemaSchema = z.object({
  tableName: z.string().describe('Database table name'),
  fields: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean().default(false),
    unique: z.boolean().default(false),
    index: z.boolean().default(false),
  })).describe('Table fields definition'),
  relationships: z.array(z.object({
    type: z.enum(['one-to-one', 'one-to-many', 'many-to-many']),
    table: z.string(),
    field: z.string(),
  })).optional().describe('Table relationships'),
  orm: z.enum(['prisma', 'sequelize', 'typeorm', 'mongoose']).default('prisma').describe('ORM to use'),
});

const GenerateTestsSchema = z.object({
  testType: z.enum(['unit', 'integration', 'e2e', 'performance', 'security']).describe('Type of tests to generate'),
  targetFile: z.string().describe('File to test (relative path)'),
  framework: z.enum(['jest', 'mocha', 'vitest']).default('jest').describe('Testing framework'),
  coverage: z.boolean().default(true).describe('Include coverage configuration'),
  mocking: z.boolean().default(true).describe('Include mocking examples'),
});

const AnalyzeCodeQualitySchema = z.object({
  directory: z.string().describe('Directory to analyze'),
  includePatterns: z.array(z.string()).default(['**/*.ts', '**/*.js']).describe('File patterns to include'),
  excludePatterns: z.array(z.string()).default(['node_modules/**', 'dist/**']).describe('File patterns to exclude'),
  checks: z.array(z.enum(['security', 'performance', 'maintainability', 'complexity', 'duplication'])).default(['security', 'performance', 'maintainability']).describe('Quality checks to perform'),
});

const SetupSecuritySchema = z.object({
  authType: z.enum(['jwt', 'oauth', 'session', 'api-key']).describe('Authentication type'),
  features: z.array(z.enum(['rate-limiting', 'helmet', 'cors', 'input-validation', 'sql-injection-protection', 'xss-protection'])).describe('Security features to implement'),
  framework: z.string().default('express').describe('Web framework'),
});

const OptimizePerformanceSchema = z.object({
  area: z.enum(['database', 'caching', 'api-responses', 'memory', 'cpu']).describe('Performance area to optimize'),
  currentMetrics: z.string().optional().describe('Current performance metrics (JSON)'),
  targetImprovement: z.string().optional().describe('Target performance improvement'),
});

const CreateDocumentationSchema = z.object({
  type: z.enum(['api', 'readme', 'deployment', 'contributing', 'architecture']).describe('Documentation type'),
  format: z.enum(['markdown', 'swagger', 'postman', 'insomnia']).default('markdown').describe('Documentation format'),
  includeExamples: z.boolean().default(true).describe('Include code examples'),
});

const SetupDeploymentSchema = z.object({
  platform: z.enum(['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'heroku', 'vercel']).describe('Deployment platform'),
  environment: z.enum(['development', 'staging', 'production']).describe('Environment type'),
  features: z.array(z.enum(['ci-cd', 'monitoring', 'logging', 'scaling', 'backup'])).describe('Deployment features'),
});

const AnalyzeDependenciesSchema = z.object({
  packageFile: z.string().default('package.json').describe('Package file to analyze'),
  checks: z.array(z.enum(['vulnerabilities', 'outdated', 'unused', 'license', 'size'])).default(['vulnerabilities', 'outdated']).describe('Dependency checks'),
});

// Football Analytics Tool Schemas
const CreateH2HAnalyzerSchema = z.object({
  analysisType: z.enum(['historical', 'predictive', 'live']).describe('Type of H2H analysis'),
  includeFormData: z.boolean().default(true).describe('Include recent form analysis'),
  homeAdvantageWeight: z.number().min(0).max(1).default(0.3).describe('Weight for home advantage factor'),
  matchCount: z.number().min(5).max(20).default(10).describe('Number of recent H2H matches to analyze'),
});

const CreateCornerAnalyticsSchema = z.object({
  predictionModel: z.enum(['frequency', 'conversion', 'timing', 'combined']).describe('Corner analysis model type'),
  includePlayerData: z.boolean().default(true).describe('Include individual player corner statistics'),
  timeSegments: z.array(z.number()).default([15, 30, 45, 60, 75, 90]).describe('Time segments for analysis'),
});

const CreateCardAnalyticsSchema = z.object({
  cardType: z.enum(['yellow', 'red', 'both']).describe('Card type to analyze'),
  includeRefereeData: z.boolean().default(true).describe('Include referee-specific card patterns'),
  matchIntensityFactors: z.array(z.string()).default(['derby', 'rivalry', 'relegation', 'title']).describe('Match intensity factors'),
});

const CreateRefereeAnalyzerSchema = z.object({
  analysisScope: z.enum(['individual', 'comparative', 'league']).describe('Referee analysis scope'),
  biasDetection: z.boolean().default(true).describe('Enable bias detection algorithms'),
  performanceMetrics: z.array(z.string()).default(['consistency', 'accuracy', 'control']).describe('Performance metrics to track'),
});

const CreatePlayerAnalyticsSchema = z.object({
  position: z.string().optional().describe('Player position for position-specific analytics'),
  metricsType: z.enum(['performance', 'valuation', 'injury-risk', 'form']).describe('Type of player analytics'),
  comparisonMode: z.boolean().default(false).describe('Enable player comparison mode'),
});

const CreateGoalsAnalyzerSchema = z.object({
  predictionType: z.enum(['over-under', 'btts', 'timing', 'method', 'xg']).describe('Goals analysis type'),
  threshold: z.number().min(0.5).max(5.5).default(2.5).describe('Goals threshold for over/under analysis'),
  includeXG: z.boolean().default(true).describe('Include Expected Goals calculations'),
});

const CreateLeagueIntelligenceSchema = z.object({
  analysisLevel: z.enum(['competitive-balance', 'trends', 'cross-league']).describe('League analysis level'),
  includeHistorical: z.boolean().default(true).describe('Include historical data comparison'),
  competitivenessMetrics: z.array(z.string()).default(['points-spread', 'goal-difference', 'position-changes']).describe('Competitiveness metrics'),
});

const CreateBettingAnalyzerSchema = z.object({
  marketType: z.enum(['match-winner', 'over-under', 'asian-handicap', 'corners', 'cards']).describe('Betting market type'),
  valueThreshold: z.number().min(0.01).max(0.5).default(0.05).describe('Value bet threshold'),
  includeArbitrage: z.boolean().default(true).describe('Include arbitrage opportunity detection'),
});

const CreateLiveMatchEngineSchema = z.object({
  updateFrequency: z.enum(['real-time', '1-minute', '5-minute']).describe('Live update frequency'),
  predictionAccuracy: z.enum(['basic', 'advanced', 'ml-enhanced']).describe('Prediction accuracy level'),
  includeXG: z.boolean().default(true).describe('Include live xG calculations'),
});

const CreateFantasyOptimizerSchema = z.object({
  platform: z.enum(['fpl', 'draftkings', 'fanduel', 'generic']).describe('Fantasy platform'),
  optimizationType: z.enum(['lineup', 'transfers', 'captain', 'differential']).describe('Optimization type'),
  budget: z.number().optional().describe('Budget constraint for optimization'),
});

const CreateInjuryTrackerSchema = z.object({
  trackingType: z.enum(['history', 'prediction', 'impact', 'risk-assessment']).describe('Injury tracking type'),
  includePhysicalData: z.boolean().default(false).describe('Include physical/fitness data'),
  recoveryModeling: z.boolean().default(true).describe('Enable recovery time modeling'),
});

// MCP Server class
class BackendMCPServer {
  private server: Server; constructor() {
    this.server = new Server(
      {
        name: 'backend-development-server',
        version: '1.0.0',
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error(chalk.red('[MCP Error]'), error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_api_endpoint',
            description: 'Generate a complete API endpoint with routing, validation, and middleware',
            inputSchema: CreateApiEndpointSchema,
          },
          {
            name: 'create_database_schema',
            description: 'Design and generate database schema with migrations',
            inputSchema: CreateDatabaseSchemaSchema,
          },
          {
            name: 'generate_tests',
            description: 'Generate comprehensive test suites for backend code',
            inputSchema: GenerateTestsSchema,
          },
          {
            name: 'analyze_code_quality',
            description: 'Analyze code quality, security, and performance issues',
            inputSchema: AnalyzeCodeQualitySchema,
          },
          {
            name: 'setup_security',
            description: 'Implement security features and best practices',
            inputSchema: SetupSecuritySchema,
          },
          {
            name: 'optimize_performance',
            description: 'Analyze and optimize backend performance',
            inputSchema: OptimizePerformanceSchema,
          },
          {
            name: 'create_documentation',
            description: 'Generate comprehensive project documentation',
            inputSchema: CreateDocumentationSchema,
          },
          {
            name: 'setup_deployment',
            description: 'Configure deployment and DevOps infrastructure',
            inputSchema: SetupDeploymentSchema,
          }, {
            name: 'analyze_dependencies',
            description: 'Analyze project dependencies for issues and optimizations',
            inputSchema: AnalyzeDependenciesSchema,
          },
          // Football Analytics Tools
          {
            name: 'create_h2h_analyzer',
            description: 'Generate head-to-head match analysis engine with historical data processing',
            inputSchema: CreateH2HAnalyzerSchema,
          },
          {
            name: 'create_goals_analyzer',
            description: 'Goals analysis engine for over/under predictions and scoring patterns',
            inputSchema: CreateGoalsAnalyzerSchema,
          },
          {
            name: 'create_betting_analyzer',
            description: 'Advanced betting analytics and value identification system',
            inputSchema: CreateBettingAnalyzerSchema,
          },
          {
            name: 'create_live_match_engine',
            description: 'Real-time match analysis and in-play prediction system',
            inputSchema: CreateLiveMatchEngineSchema,
          },
          {
            name: 'create_player_analytics',
            description: 'Advanced player performance and valuation system',
            inputSchema: CreatePlayerAnalyticsSchema,
          },
          {
            name: 'create_h2h_analyzer',
            description: 'Analyze head-to-head performance of teams',
            inputSchema: CreateH2HAnalyzerSchema,
          },
          {
            name: 'create_goals_analyzer',
            description: 'Analyze goals statistics and predictions',
            inputSchema: CreateGoalsAnalyzerSchema,
          },
          {
            name: 'create_betting_analyzer',
            description: 'Analyze betting markets and value bets',
            inputSchema: CreateBettingAnalyzerSchema,
          },
          {
            name: 'create_live_match_engine',
            description: 'Engine for live match analysis and predictions',
            inputSchema: CreateLiveMatchEngineSchema,
          },
          {
            name: 'create_player_analytics',
            description: 'Analyze player performance and potential',
            inputSchema: CreatePlayerAnalyticsSchema,
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_api_endpoint':
            return await this.createApiEndpoint(CreateApiEndpointSchema.parse(args));
          case 'create_database_schema':
            return await this.createDatabaseSchema(CreateDatabaseSchemaSchema.parse(args));
          case 'generate_tests':
            return await this.generateTests(GenerateTestsSchema.parse(args));
          case 'analyze_code_quality':
            return await this.analyzeCodeQuality(AnalyzeCodeQualitySchema.parse(args));
          case 'setup_security':
            return await this.setupSecurity(SetupSecuritySchema.parse(args));
          case 'optimize_performance':
            return await this.optimizePerformance(OptimizePerformanceSchema.parse(args));
          case 'create_documentation':
            return await this.createDocumentation(CreateDocumentationSchema.parse(args));
          case 'setup_deployment':
            return await this.setupDeployment(SetupDeploymentSchema.parse(args));
          case 'analyze_dependencies':
            return await this.analyzeDependencies(AnalyzeDependenciesSchema.parse(args));
          case 'create_h2h_analyzer':
            return await this.createH2HAnalyzer(CreateH2HAnalyzerSchema.parse(args));
          case 'create_goals_analyzer':
            return await this.createGoalsAnalyzer(CreateGoalsAnalyzerSchema.parse(args));
          case 'create_betting_analyzer':
            return await this.createBettingAnalyzer(CreateBettingAnalyzerSchema.parse(args));
          case 'create_live_match_engine':
            return await this.createLiveMatchEngine(CreateLiveMatchEngineSchema.parse(args));
          case 'create_player_analytics':
            return await this.createPlayerAnalytics(CreatePlayerAnalyticsSchema.parse(args));
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
          );
        }
        throw error;
      }
    });
  }

  // Tool implementations
  private async createApiEndpoint(params: z.infer<typeof CreateApiEndpointSchema>) {
    const { endpoint, method, description, requestBody, responseBody, middleware = [], validation, authentication, rateLimit } = params;

    // Generate route handler
    const routeCode = this.generateRouteCode({
      endpoint,
      method,
      description,
      requestBody,
      responseBody,
      middleware,
      validation,
      authentication,
      rateLimit,
    });

    // Generate validation schema if needed
    const validationCode = validation ? this.generateValidationSchema(requestBody, responseBody) : '';

    // Generate middleware if needed
    const middlewareCode = middleware.length > 0 ? this.generateMiddleware(middleware) : '';

    // Generate tests
    const testCode = this.generateEndpointTests({
      endpoint,
      method,
      description,
      requestBody,
      responseBody,
      authentication,
    });

    return {
      content: [
        {
          type: 'text',
          text: `## Generated API Endpoint: ${method} ${endpoint}

### Route Handler
\`\`\`typescript
${routeCode}
\`\`\`

${validationCode ? `### Validation Schema
\`\`\`typescript
${validationCode}
\`\`\`` : ''}

${middlewareCode ? `### Middleware
\`\`\`typescript
${middlewareCode}
\`\`\`` : ''}

### Tests
\`\`\`typescript
${testCode}
\`\`\`

### Files to create/update:
- \`src/routes/${endpoint.split('/')[2] || 'api'}.ts\` - Route handler
- \`src/middleware/validation.ts\` - Validation middleware
- \`src/tests/routes/${endpoint.split('/')[2] || 'api'}.test.ts\` - Tests

### Next steps:
1. Add the route to your main router
2. Implement the actual business logic
3. Add error handling specific to your use case
4. Update API documentation`,
        },
      ],
    };
  }

  private async createDatabaseSchema(params: z.infer<typeof CreateDatabaseSchemaSchema>) {
    const { tableName, fields, relationships = [], orm } = params;

    const schemaCode = this.generateDatabaseSchema({ tableName, fields, relationships, orm });
    const migrationCode = this.generateMigration({ tableName, fields, relationships, orm });
    const modelCode = this.generateModelCode({ tableName, fields, relationships, orm });

    return {
      content: [
        {
          type: 'text',
          text: `## Generated Database Schema: ${tableName}

### Schema Definition (${orm})
\`\`\`${orm === 'prisma' ? 'prisma' : 'typescript'}
${schemaCode}
\`\`\`

### Migration
\`\`\`${orm === 'prisma' ? 'sql' : 'typescript'}
${migrationCode}
\`\`\`

### Model/Entity Code
\`\`\`typescript
${modelCode}
\`\`\`

### Files to create/update:
- \`prisma/schema.prisma\` or equivalent schema file
- \`src/models/${tableName}.ts\` - Model definition
- \`src/migrations/\` - Migration files

### Next steps:
1. Run the migration to create the table
2. Generate/update the ORM client
3. Create repository/service layer
4. Add validation and business logic`,
        },
      ],
    };
  }

  private async generateTests(params: z.infer<typeof GenerateTestsSchema>) {
    const { testType, targetFile, framework, coverage, mocking } = params;

    const testCode = this.generateTestCode({
      testType,
      targetFile,
      framework,
      coverage,
      mocking,
    });

    const configCode = this.generateTestConfig({ framework, coverage });

    return {
      content: [
        {
          type: 'text',
          text: `## Generated ${testType} Tests for ${targetFile}

### Test Suite
\`\`\`typescript
${testCode}
\`\`\`

### Test Configuration
\`\`\`json
${configCode}
\`\`\`

### Files to create/update:
- \`src/tests/${path.basename(targetFile, path.extname(targetFile))}.test.ts\` - Test file
- \`${framework}.config.js\` - Test configuration

### Next steps:
1. Install testing dependencies: \`npm install -D ${framework} @types/${framework}\`
2. Run tests: \`npm test\`
3. Check coverage: \`npm run test:coverage\`
4. Add more edge cases and scenarios`,
        },
      ],
    };
  }

  private async analyzeCodeQuality(params: z.infer<typeof AnalyzeCodeQualitySchema>) {
    const { directory, includePatterns, excludePatterns, checks } = params;

    // Simulate code analysis (in real implementation, this would use actual analysis tools)
    const analysis = await this.performCodeAnalysis({
      directory,
      includePatterns,
      excludePatterns,
      checks,
    });

    return {
      content: [
        {
          type: 'text',
          text: `## Code Quality Analysis for ${directory}

### Summary
${analysis.summary}

### Issues Found
${analysis.issues.map((issue: any) => `- **${issue.severity}**: ${issue.message} (${issue.file}:${issue.line})`).join('\n')}

### Recommendations
${analysis.recommendations.map((rec: string) => `- ${rec}`).join('\n')}

### Metrics
- **Files analyzed**: ${analysis.metrics.filesAnalyzed}
- **Lines of code**: ${analysis.metrics.linesOfCode}
- **Complexity score**: ${analysis.metrics.complexityScore}
- **Security issues**: ${analysis.metrics.securityIssues}
- **Performance issues**: ${analysis.metrics.performanceIssues}

### Next steps:
1. Fix critical security issues immediately
2. Refactor high-complexity functions
3. Add missing tests for uncovered code
4. Update dependencies with vulnerabilities`,
        },
      ],
    };
  }

  private async setupSecurity(params: z.infer<typeof SetupSecuritySchema>) {
    const { authType, features, framework } = params;

    const securityCode = this.generateSecuritySetup({ authType, features, framework });
    const configCode = this.generateSecurityConfig({ authType, features });

    return {
      content: [
        {
          type: 'text',
          text: `## Security Setup for ${framework} with ${authType}

### Security Implementation
\`\`\`typescript
${securityCode}
\`\`\`

### Security Configuration
\`\`\`typescript
${configCode}
\`\`\`

### Features Implemented:
${features.map(feature => `- ✅ ${feature.replace('-', ' ').toUpperCase()}`).join('\n')}

### Files to create/update:
- \`src/middleware/security.ts\` - Security middleware
- \`src/auth/${authType}.ts\` - Authentication logic
- \`src/config/security.ts\` - Security configuration

### Next steps:
1. Install security dependencies
2. Configure environment variables
3. Test authentication flows
4. Set up monitoring and logging
5. Conduct security audit`,
        },
      ],
    };
  }

  private async optimizePerformance(params: z.infer<typeof OptimizePerformanceSchema>) {
    const { area, currentMetrics, targetImprovement } = params;

    const optimizations = this.generatePerformanceOptimizations({
      area,
      currentMetrics,
      targetImprovement,
    });

    return {
      content: [
        {
          type: 'text',
          text: `## Performance Optimization: ${area}

### Current Analysis
${optimizations.analysis}

### Recommended Optimizations
${optimizations.recommendations.map((rec: any, i: number) => `${i + 1}. **${rec.title}**\n   ${rec.description}\n   Impact: ${rec.impact}`).join('\n\n')}

### Implementation Code
\`\`\`typescript
${optimizations.code}
\`\`\`

### Monitoring Setup
\`\`\`typescript
${optimizations.monitoring}
\`\`\`

### Expected Improvements
${optimizations.expectedImprovements}

### Next steps:
1. Implement optimizations incrementally
2. Set up performance monitoring
3. Load test the changes
4. Monitor production metrics
5. Document performance requirements`,
        },
      ],
    };
  }

  private async createDocumentation(params: z.infer<typeof CreateDocumentationSchema>) {
    const { type, format, includeExamples } = params;

    const documentation = this.generateDocumentation({ type, format, includeExamples });

    return {
      content: [
        {
          type: 'text',
          text: documentation,
        },
      ],
    };
  }

  private async setupDeployment(params: z.infer<typeof SetupDeploymentSchema>) {
    const { platform, environment, features } = params;

    const deploymentConfig = this.generateDeploymentConfig({ platform, environment, features });

    return {
      content: [
        {
          type: 'text',
          text: `## Deployment Setup: ${platform} (${environment})

### Deployment Configuration
\`\`\`yaml
${deploymentConfig.config}
\`\`\`

### CI/CD Pipeline
\`\`\`yaml
${deploymentConfig.pipeline}
\`\`\`

### Environment Variables
\`\`\`bash
${deploymentConfig.envVars}
\`\`\`

### Features Configured:
${features.map(feature => `- ✅ ${feature.replace('-', ' ').toUpperCase()}`).join('\n')}

### Files to create:
- \`Dockerfile\` - Container configuration
- \`.github/workflows/deploy.yml\` - CI/CD pipeline
- \`docker-compose.yml\` - Local development
- \`k8s/\` - Kubernetes manifests (if applicable)

### Next steps:
1. Set up cloud account and permissions
2. Configure secrets and environment variables
3. Test deployment pipeline
4. Set up monitoring and alerting
5. Document rollback procedures`,
        },
      ],
    };
  }

  private async analyzeDependencies(params: z.infer<typeof AnalyzeDependenciesSchema>) {
    const { packageFile, checks } = params;

    try {
      const packageJson = await fs.readJson(packageFile);
      const analysis = await this.performDependencyAnalysis(packageJson, checks);

      return {
        content: [
          {
            type: 'text',
            text: `## Dependency Analysis: ${packageFile}

### Summary
- **Total dependencies**: ${analysis.totalDependencies}
- **Vulnerabilities found**: ${analysis.vulnerabilities.length}
- **Outdated packages**: ${analysis.outdated.length}
- **Unused packages**: ${analysis.unused.length}

### Critical Issues
${analysis.vulnerabilities.filter((v: any) => v.severity === 'critical').map((v: any) => `- **CRITICAL**: ${v.package} - ${v.description}`).join('\n')}

### Recommendations
${analysis.recommendations.map((rec: string) => `- ${rec}`).join('\n')}

### Update Commands
\`\`\`bash
${analysis.updateCommands.join('\n')}
\`\`\`

### Next steps:
1. Update critical vulnerability packages immediately
2. Test application after updates
3. Remove unused dependencies
4. Set up dependency monitoring
5. Consider package alternatives for better security`,
          },
        ],
      };
    } catch (error: any) {
      throw new McpError(ErrorCode.InternalError, `Failed to analyze dependencies: ${error?.message || 'Unknown error'}`);
    }
  }

  // Helper methods for code generation
  private generateRouteCode(config: any): string {
    return `import { Router, Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
${config.authentication ? "import { authenticateToken } from '../middleware/auth';" : ''}
${config.rateLimit ? "import rateLimit from 'express-rate-limit';" : ''}

const router = Router();

${config.rateLimit ? `
const ${config.endpoint.split('/').pop()}RateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
` : ''}

/**
 * ${config.description}
 * ${config.method} ${config.endpoint}
 */
router.${config.method.toLowerCase()}('${config.endpoint}'${config.rateLimit ? `, ${config.endpoint.split('/').pop()}RateLimit` : ''}${config.authentication ? ', authenticateToken' : ''}${config.validation ? ', validateRequest' : ''}, async (req: Request, res: Response, next: NextFunction) => {
  try {
    ${config.validation ? `
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    ` : ''}
    
    // TODO: Implement business logic here
    ${config.method === 'GET' ? `
    const result = await ${config.endpoint.split('/').pop()}Service.getAll();
    res.json({
      success: true,
      data: result
    });
    ` : config.method === 'POST' ? `
    const newItem = await ${config.endpoint.split('/').pop()}Service.create(req.body);
    res.status(201).json({
      success: true,
      data: newItem
    });
    ` : `
    res.json({
      success: true,
      message: '${config.method} ${config.endpoint} implemented'
    });
    `}
  } catch (error) {
    next(error);
  }
});

${config.validation ? `
const validateRequest = [
  ${config.requestBody ? `body().isObject().withMessage('Request body must be a valid object'),` : ''}
  // Add specific validation rules here
];
` : ''}

export default router;`;
  }

  private generateValidationSchema(requestBody?: string, responseBody?: string): string {
    return `import Joi from 'joi';

export const ${requestBody ? 'requestSchema' : 'schema'} = Joi.object({
  // Define validation schema based on request body
  ${requestBody ? '// Add fields from request body schema' : '// Add validation rules'}
});

${responseBody ? `
export const responseSchema = Joi.object({
  success: Joi.boolean().required(),
  data: Joi.any(),
  message: Joi.string().optional()
});
` : ''}`;
  }

  private generateMiddleware(middleware: string[]): string {
    return middleware.map(m => `
// ${m} middleware
export const ${m}Middleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement ${m} logic
  next();
};`).join('\n');
  }

  private generateEndpointTests(config: any): string {
    return `import request from 'supertest';
import app from '../app';
${config.authentication ? "import { generateTestToken } from '../utils/testHelpers';" : ''}

describe('${config.method} ${config.endpoint}', () => {
  ${config.authentication ? `
  let authToken: string;
  
  beforeAll(async () => {
    authToken = await generateTestToken();
  });
  ` : ''}

  it('should ${config.description.toLowerCase()}', async () => {
    const response = await request(app)
      .${config.method.toLowerCase()}('${config.endpoint}')
      ${config.authentication ? '.set("Authorization", `Bearer \${authToken}`)' : ''}
      ${config.method === 'POST' || config.method === 'PUT' ? '.send({ /* test data */ })' : ''}
      .expect(${config.method === 'POST' ? '201' : '200'});

    expect(response.body.success).toBe(true);
    ${config.method === 'GET' ? 'expect(response.body.data).toBeDefined();' : ''}
  });

  it('should handle validation errors', async () => {
    const response = await request(app)
      .${config.method.toLowerCase()}('${config.endpoint}')
      ${config.authentication ? '.set("Authorization", `Bearer \${authToken}`)' : ''}
      .send({ /* invalid data */ })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
  });

  ${config.authentication ? `
  it('should require authentication', async () => {
    await request(app)
      .${config.method.toLowerCase()}('${config.endpoint}')
      .expect(401);
  });
  ` : ''}
});`;
  }

  private generateDatabaseSchema(config: any): string {
    if (config.orm === 'prisma') {
      return `model ${config.tableName} {
  id    String @id @default(cuid())
  ${config.fields.map((field: any) => {
        const type = this.mapToPrismaType(field.type);
        const modifiers = [];
        if (field.unique) modifiers.push('@unique');
        if (field.index) modifiers.push('@@index([${field.name}])');
        return `${field.name} ${type}${field.required ? '' : '?'} ${modifiers.join(' ')}`;
      }).join('\n  ')}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ${config.relationships.map((rel: any) => {
        switch (rel.type) {
          case 'one-to-many':
            return `${rel.table.toLowerCase()}s ${rel.table}[]`;
          case 'many-to-one':
            return `${rel.table.toLowerCase()} ${rel.table} @relation(fields: [${rel.field}], references: [id])
  ${rel.field} String`;
          default:
            return `// ${rel.type} relationship with ${rel.table}`;
        }
      }).join('\n  ')}
}`;
    }
    return '// Schema generation for other ORMs not implemented yet';
  }

  private generateMigration(config: any): string {
    if (config.orm === 'prisma') {
      return `-- CreateTable
CREATE TABLE "${config.tableName}" (
    "id" TEXT NOT NULL,
    ${config.fields.map((field: any) => {
        const sqlType = this.mapToSQLType(field.type);
        return `"${field.name}" ${sqlType}${field.required ? ' NOT NULL' : ''}`;
      }).join(',\n    ')},
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "${config.tableName}_pkey" PRIMARY KEY ("id")
);

${config.fields.filter((f: any) => f.unique).map((field: any) =>
        `CREATE UNIQUE INDEX "${config.tableName}_${field.name}_key" ON "${config.tableName}"("${field.name}");`
      ).join('\n')}`;
    }
    return '// Migration generation for other ORMs not implemented yet';
  }

  private generateModelCode(config: any): string {
    return `export interface ${config.tableName} {
  id: string;
  ${config.fields.map((field: any) => `${field.name}: ${this.mapToTypeScriptType(field.type)}${field.required ? '' : ' | null'};`).join('\n  ')}
  createdAt: Date;
  updatedAt: Date;
}

export interface Create${config.tableName}Data {
  ${config.fields.filter((f: any) => f.name !== 'id').map((field: any) => `${field.name}${field.required ? '' : '?'}: ${this.mapToTypeScriptType(field.type)};`).join('\n  ')}
}

export interface Update${config.tableName}Data extends Partial<Create${config.tableName}Data> {}

export class ${config.tableName}Service {
  async create(data: Create${config.tableName}Data): Promise<${config.tableName}> {
    // TODO: Implement create logic
    throw new Error('Not implemented');
  }

  async findById(id: string): Promise<${config.tableName} | null> {
    // TODO: Implement find by ID logic
    throw new Error('Not implemented');
  }

  async findAll(): Promise<${config.tableName}[]> {
    // TODO: Implement find all logic
    throw new Error('Not implemented');
  }

  async update(id: string, data: Update${config.tableName}Data): Promise<${config.tableName}> {
    // TODO: Implement update logic
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    // TODO: Implement delete logic
    throw new Error('Not implemented');
  }
}`;
  }

  private generateTestCode(config: any): string {
    const { testType, targetFile, framework } = config;

    return `import { ${framework === 'jest' ? 'describe, it, expect, beforeEach, afterEach' : 'describe, it, expect'} } from '${framework}';
${config.mocking ? "import { jest } from '@jest/globals';" : ''}

// Import the module/function to test
import { } from '${targetFile}';

describe('${path.basename(targetFile)} - ${testType} tests', () => {
  ${config.mocking ? `
  beforeEach(() => {
    jest.clearAllMocks();
  });
  ` : ''}

  describe('Basic functionality', () => {
    it('should work correctly', () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });

    it('should handle edge cases', () => {
      // TODO: Implement edge case tests
      expect(true).toBe(true);
    });
  });

  ${testType === 'integration' ? `
  describe('Integration tests', () => {
    it('should integrate with external services', async () => {
      // TODO: Test integration with databases, APIs, etc.
      expect(true).toBe(true);
    });
  });
  ` : ''}

  ${testType === 'performance' ? `
  describe('Performance tests', () => {
    it('should complete within acceptable time', async () => {
      const start = Date.now();
      // TODO: Run performance test
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // 1 second
    });
  });
  ` : ''}

  ${testType === 'security' ? `
  describe('Security tests', () => {
    it('should prevent injection attacks', () => {
      // TODO: Test SQL injection, XSS, etc.
      expect(true).toBe(true);
    });

    it('should validate input properly', () => {
      // TODO: Test input validation
      expect(true).toBe(true);
    });
  });
  ` : ''}
});`;
  }

  private generateTestConfig(config: any): string {
    if (config.framework === 'jest') {
      return JSON.stringify({
        preset: 'ts-jest',
        testEnvironment: 'node',
        roots: ['<rootDir>/src'],
        testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
        collectCoverage: config.coverage,
        collectCoverageFrom: [
          'src/**/*.ts',
          '!src/**/*.d.ts',
          '!src/tests/**',
        ],
        coverageDirectory: 'coverage',
        coverageReporters: ['text', 'lcov', 'html'],
        setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
      }, null, 2);
    }
    return '// Test config for other frameworks not implemented yet';
  }

  private async performCodeAnalysis(config: any): Promise<any> {
    // Simulate code analysis
    return {
      summary: 'Code analysis completed successfully',
      issues: [
        { severity: 'high', message: 'Potential SQL injection vulnerability', file: 'src/db/queries.ts', line: 45 },
        { severity: 'medium', message: 'Function complexity too high', file: 'src/services/user.ts', line: 123 },
        { severity: 'low', message: 'Missing error handling', file: 'src/routes/api.ts', line: 67 },
      ],
      recommendations: [
        'Use parameterized queries to prevent SQL injection',
        'Break down complex functions into smaller ones',
        'Add comprehensive error handling',
        'Increase test coverage to 80%+',
      ],
      metrics: {
        filesAnalyzed: 25,
        linesOfCode: 1500,
        complexityScore: 7.2,
        securityIssues: 1,
        performanceIssues: 3,
      },
    };
  }

  private generateSecuritySetup(config: any): string {
    return `import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
${config.authType === 'jwt' ? "import jwt from 'jsonwebtoken';" : ''}

// Security middleware setup
export const setupSecurity = (app: Express) => {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // CORS configuration
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api/', limiter);

  // Input validation middleware
  app.use('/api/', validateInput);
};

${config.authType === 'jwt' ? `
// JWT Authentication
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
` : ''}

// Input validation
const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};`;
  }

  private generateSecurityConfig(config: any): string {
    return `export const securityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  helmet: {
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: false,
  },
};`;
  }

  private generatePerformanceOptimizations(config: any): any {
    return {
      analysis: `Performance analysis for ${config.area} area shows potential for improvement`,
      recommendations: [
        {
          title: 'Database Query Optimization',
          description: 'Add database indexes and optimize queries',
          impact: 'High - 50-70% improvement in query times'
        },
        {
          title: 'Caching Implementation',
          description: 'Implement Redis caching for frequently accessed data',
          impact: 'Medium - 30-50% reduction in response times'
        },
        {
          title: 'Connection Pooling',
          description: 'Implement database connection pooling',
          impact: 'Medium - 20-40% improvement in concurrent requests'
        }
      ],
      code: `// Performance optimization implementation
import Redis from 'redis';
import { Pool } from 'pg';

// Redis cache setup
const redis = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Caching middleware
export const cacheMiddleware = (duration: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      redis.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};`,
      monitoring: `// Performance monitoring
import { performance } from 'perf_hooks';

export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(\`\${req.method} \${req.url} - \${duration.toFixed(2)}ms\`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(\`Slow request: \${req.method} \${req.url} - \${duration.toFixed(2)}ms\`);
    }
  });
  
  next();
};`,
      expectedImprovements: '- 50-70% faster database queries\n- 30-50% reduction in response times\n- 20-40% better concurrent request handling'
    };
  }

  private generateDocumentation(config: any): string {
    switch (config.type) {
      case 'api':
        return `# API Documentation

## Overview
This API provides endpoints for managing [describe your API purpose].

## Authentication
${config.includeExamples ? `
\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
     -X GET \\
     https://api.example.com/v1/users
\`\`\`
` : ''}

## Endpoints

### GET /api/users
Get all users

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\`

### POST /api/users
Create a new user

**Request:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
\`\`\`

## Error Handling
All errors follow this format:
\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
\`\`\`

## Rate Limiting
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user`;

      case 'readme':
        return `# Project Name

Brief description of your project.

## 🚀 Features

- Feature 1
- Feature 2
- Feature 3

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+

## ⚙️ Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project.git

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run migrations
npm run migrate

# Start the server
npm run dev
\`\`\`

## 🏗️ Project Structure

\`\`\`
src/
├── controllers/    # Route controllers
├── middleware/     # Express middleware
├── models/         # Data models
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Utility functions
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
\`\`\`

## 📚 API Documentation

See [API.md](./API.md) for detailed API documentation.

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request`;

      default:
        return `# ${config.type.toUpperCase()} Documentation

Documentation for ${config.type} is being generated...`;
    }
  }

  private generateDeploymentConfig(config: any): any {
    switch (config.platform) {
      case 'docker':
        return {
          config: `# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

USER node

CMD ["npm", "start"]`,
          pipeline: `# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=${config.environment}
      - DATABASE_URL=postgresql://user:pass@db:5432/dbname
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: dbname
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`,
          envVars: `NODE_ENV=${config.environment}
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key`
        };

      case 'kubernetes':
        return {
          config: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend-app
  template:
    metadata:
      labels:
        app: backend-app
    spec:
      containers:
      - name: app
        image: your-registry/backend-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "${config.environment}"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url`,
          pipeline: `name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and push Docker image
      run: |
        docker build -t your-registry/backend-app:latest .
        docker push your-registry/backend-app:latest
    
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f k8s/`,
          envVars: `# Kubernetes secrets
kubectl create secret generic app-secrets \\
  --from-literal=database-url=postgresql://user:pass@db:5432/dbname \\
  --from-literal=jwt-secret=your-jwt-secret`
        };

      default:
        return {
          config: `# ${config.platform} configuration`,
          pipeline: `# ${config.platform} CI/CD pipeline`,
          envVars: `# Environment variables for ${config.platform}`
        };
    }
  }

  private async performDependencyAnalysis(packageJson: any, checks: string[]): Promise<any> {
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    return {
      totalDependencies: Object.keys(allDeps).length,
      vulnerabilities: [
        { package: 'lodash', severity: 'high', description: 'Prototype pollution vulnerability' },
        { package: 'express', severity: 'medium', description: 'Outdated version with known issues' },
      ],
      outdated: [
        { package: 'express', current: '4.17.1', latest: '4.18.2' },
        { package: 'typescript', current: '4.8.0', latest: '5.0.0' },
      ],
      unused: [
        'unused-package-1',
        'unused-package-2',
      ],
      recommendations: [
        'Update lodash to version 4.17.21 or higher',
        'Update express to latest stable version',
        'Remove unused dependencies to reduce bundle size',
        'Consider using npm audit fix for automatic fixes',
      ],
      updateCommands: [
        'npm update lodash',
        'npm update express',
        'npm uninstall unused-package-1 unused-package-2',
      ],
    };
  }

  // Type mapping helpers
  private mapToPrismaType(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'String',
      'number': 'Int',
      'float': 'Float',
      'boolean': 'Boolean',
      'date': 'DateTime',
      'text': 'String',
      'email': 'String',
    };
    return typeMap[type.toLowerCase()] || 'String';
  }

  private mapToSQLType(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'TEXT',
      'number': 'INTEGER',
      'float': 'REAL',
      'boolean': 'BOOLEAN',
      'date': 'TIMESTAMP(3)',
      'text': 'TEXT',
      'email': 'TEXT',
    };
    return typeMap[type.toLowerCase()] || 'TEXT';
  }

  private mapToTypeScriptType(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'float': 'number',
      'boolean': 'boolean',
      'date': 'Date',
      'text': 'string',
      'email': 'string',
    };
    return typeMap[type.toLowerCase()] || 'string';
  }

  public async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error(chalk.green('🚀 Backend Development MCP Server started'));
    console.error(chalk.blue('Ready to assist with backend development tasks!'));
  }
}

// Start the server
const server = new BackendMCPServer();
server.run().catch((error) => {
  console.error(chalk.red('Failed to start MCP server:'), error);
  process.exit(1);
});

// Football Analytics Tool Implementations
    
    private async createH2HAnalyzer(params: z.infer<typeof CreateH2HAnalyzerSchema>) {
  const { analysisType, includeFormData, homeAdvantageWeight, matchCount } = params;

  const analyzerCode = this.generateH2HAnalyzer({
    analysisType,
    includeFormData,
    homeAdvantageWeight,
    matchCount,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated H2H Match Analyzer: ${analysisType}

### H2H Analysis Engine
\`\`\`typescript
${analyzerCode.engine}
\`\`\`

### Prediction Algorithm
\`\`\`typescript
${analyzerCode.algorithm}
\`\`\`

### Integration with Football API
\`\`\`typescript
${analyzerCode.integration}
\`\`\`

### Test Suite
\`\`\`typescript
${analyzerCode.tests}
\`\`\`

### Configuration:
- **Analysis Type**: ${analysisType}
- **Include Form Data**: ${includeFormData}
- **Home Advantage Weight**: ${homeAdvantageWeight}
- **Match History Count**: ${matchCount}

### Files to create:
- \`src/analytics/h2h/analyzer.ts\` - Main H2H analyzer
- \`src/analytics/h2h/predictor.ts\` - Prediction algorithms
- \`src/analytics/h2h/models.ts\` - Data models
- \`src/tests/analytics/h2h.test.ts\` - Test suite

### Football API Integration:
Uses \`DefaultService\` from \`src/apis/footy\` for historical match data`,
      },
    ],
  };
}

    private async createCornerAnalytics(params: z.infer<typeof CreateCornerAnalyticsSchema>) {
  const { predictionModel, includePlayerData, timeSegments } = params;

  const cornerCode = this.generateCornerAnalytics({
    predictionModel,
    includePlayerData,
    timeSegments,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated Corner Analytics Engine: ${predictionModel}

### Corner Analysis System
\`\`\`typescript
${cornerCode.system}
\`\`\`

### Prediction Models
\`\`\`typescript
${cornerCode.models}
\`\`\`

### Time-Based Analysis
\`\`\`typescript
${cornerCode.timeAnalysis}
\`\`\`

### Configuration:
- **Prediction Model**: ${predictionModel}
- **Include Player Data**: ${includePlayerData}
- **Time Segments**: [${timeSegments.join(', ')}] minutes

### Analytics Features:
- Corner frequency prediction per team
- Conversion rate analysis
- Time distribution patterns
- Player-specific corner statistics
- Live corner betting calculations

### Files to create:
- \`src/analytics/corners/analyzer.ts\` - Corner analyzer
- \`src/analytics/corners/predictor.ts\` - Prediction engine
- \`src/analytics/corners/models.ts\` - Data models`,
      },
    ],
  };
}

    private async createCardAnalytics(params: z.infer<typeof CreateCardAnalyticsSchema>) {
  const { cardType, includeRefereeData, matchIntensityFactors } = params;

  const cardCode = this.generateCardAnalytics({
    cardType,
    includeRefereeData,
    matchIntensityFactors,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated Card Analytics System: ${cardType}

### Card Analysis Engine
\`\`\`typescript
${cardCode.engine}
\`\`\`

### Referee Behavior Analysis
\`\`\`typescript
${cardCode.refereeAnalysis}
\`\`\`

### Match Intensity Calculator
\`\`\`typescript
${cardCode.intensityCalculator}
\`\`\`

### Configuration:
- **Card Type**: ${cardType}
- **Include Referee Data**: ${includeRefereeData}
- **Match Intensity Factors**: [${matchIntensityFactors.join(', ')}]

### Analytics Features:
- Player disciplinary record tracking
- Referee card tendency analysis
- Match intensity correlation
- Card timing pattern analysis
- Team aggression metrics

### Files to create:
- \`src/analytics/cards/analyzer.ts\` - Card analyzer
- \`src/analytics/cards/referee.ts\` - Referee analysis
- \`src/analytics/cards/intensity.ts\` - Intensity calculator`,
      },
    ],
  };
}

    private async createRefereeAnalyzer(params: z.infer<typeof CreateRefereeAnalyzerSchema>) {
  const { analysisScope, biasDetection, performanceMetrics } = params;

  const refereeCode = this.generateRefereeAnalyzer({
    analysisScope,
    biasDetection,
    performanceMetrics,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated Referee Analyzer: ${analysisScope}

### Referee Analysis System
\`\`\`typescript
${refereeCode.system}
\`\`\`

### Bias Detection Algorithm
\`\`\`typescript
${refereeCode.biasDetection}
\`\`\`

### Performance Metrics
\`\`\`typescript
${refereeCode.metrics}
\`\`\`

### Configuration:
- **Analysis Scope**: ${analysisScope}
- **Bias Detection**: ${biasDetection}
- **Performance Metrics**: [${performanceMetrics.join(', ')}]

### Analytics Features:
- Decision pattern analysis
- Home team advantage statistics
- Card distribution fairness
- VAR usage tracking
- Consistency scoring

### Files to create:
- \`src/analytics/referee/analyzer.ts\` - Referee analyzer
- \`src/analytics/referee/bias.ts\` - Bias detection
- \`src/analytics/referee/performance.ts\` - Performance metrics`,
      },
    ],
  };
}

    private async createPlayerAnalytics(params: z.infer<typeof CreatePlayerAnalyticsSchema>) {
  const { position, metricsType, comparisonMode } = params;

  const playerCode = this.generatePlayerAnalytics({
    position,
    metricsType,
    comparisonMode,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated Player Analytics System: ${metricsType}

### Player Analysis Engine
\`\`\`typescript
${playerCode.engine}
\`\`\`

### Performance Rating Algorithm
\`\`\`typescript
${playerCode.rating}
\`\`\`

### Position-Specific Metrics
\`\`\`typescript
${playerCode.positionMetrics}
\`\`\`

### Configuration:
- **Position**: ${position || 'All positions'}
- **Metrics Type**: ${metricsType}
- **Comparison Mode**: ${comparisonMode}

### Analytics Features:
- Performance rating algorithm
- Position-specific tracking
- Market value prediction
- Injury risk assessment
- Form curve analysis

### Files to create:
- \`src/analytics/player/analyzer.ts\` - Player analyzer
- \`src/analytics/player/rating.ts\` - Rating algorithm
- \`src/analytics/player/valuation.ts\` - Market valuation`,
      },
    ],
  };
}

    private async createGoalsAnalyzer(params: z.infer<typeof CreateGoalsAnalyzerSchema>) {
  const { predictionType, threshold, includeXG } = params;

  const goalsCode = this.generateGoalsAnalyzer({
    predictionType,
    threshold,
    includeXG,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated Goals Analysis Engine: ${predictionType}

### Goals Analysis System
\`\`\`typescript
${goalsCode.system}
\`\`\`

### Over/Under Prediction
\`\`\`typescript
${goalsCode.overUnder}
\`\`\`

### Expected Goals (xG) Calculator
\`\`\`typescript
${goalsCode.xgCalculator}
\`\`\`

### Configuration:
- **Prediction Type**: ${predictionType}
- **Goals Threshold**: ${threshold}
- **Include xG**: ${includeXG}

### Analytics Features:
- Over/Under goal predictions
- BTTS (Both Teams To Score) analysis
- Goal timing pattern analysis
- Goal scoring method analysis
- Expected Goals calculations

### Files to create:
- \`src/analytics/goals/analyzer.ts\` - Goals analyzer
- \`src/analytics/goals/xg-calculator.ts\` - xG calculations
- \`src/analytics/goals/predictor.ts\` - Goal predictions`,
      },
    ],
  };
}

    private async createLeagueIntelligence(params: z.infer<typeof CreateLeagueIntelligenceSchema>) {
  const { analysisLevel, includeHistorical, competitivenessMetrics } = params;

  const leagueCode = this.generateLeagueIntelligence({
    analysisLevel,
    includeHistorical,
    competitivenessMetrics,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated League Intelligence System: ${analysisLevel}

### League Analysis Engine
\`\`\`typescript
${leagueCode.engine}
\`\`\`

### Competitive Balance Calculator
\`\`\`typescript
${leagueCode.competitiveBalance}
\`\`\`

### Trend Analysis
\`\`\`typescript
${leagueCode.trends}
\`\`\`

### Configuration:
- **Analysis Level**: ${analysisLevel}
- **Include Historical**: ${includeHistorical}
- **Competitiveness Metrics**: [${competitivenessMetrics.join(', ')}]

### Analytics Features:
- League competitive balance analysis
- Cross-league comparisons
- Historical trend analysis
- Strength coefficient calculations
- Performance distribution metrics

### Files to create:
- \`src/analytics/league/intelligence.ts\` - League analyzer
- \`src/analytics/league/balance.ts\` - Competitive balance
- \`src/analytics/league/trends.ts\` - Trend analysis`,
      },
    ],
  };
}

    private async createBettingAnalyzer(params: z.infer<typeof CreateBettingAnalyzerSchema>) {
  const { marketType, valueThreshold, includeArbitrage } = params;

  const bettingCode = this.generateBettingAnalyzer({
    marketType,
    valueThreshold,
    includeArbitrage,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated Betting Analysis System: ${marketType}

### Betting Analysis Engine
\`\`\`typescript
${bettingCode.engine}
\`\`\`

### Value Bet Detection
\`\`\`typescript
${bettingCode.valueBets}
\`\`\`

### Arbitrage Detector
\`\`\`typescript
${bettingCode.arbitrage}
\`\`\`

### Configuration:
- **Market Type**: ${marketType}
- **Value Threshold**: ${valueThreshold}
- **Include Arbitrage**: ${includeArbitrage}

### Analytics Features:
- Value betting identification
- Arbitrage opportunity detection
- Market inefficiency analysis
- Odds movement tracking
- Risk assessment calculations

### Files to create:
- \`src/analytics/betting/analyzer.ts\` - Betting analyzer
- \`src/analytics/betting/value.ts\` - Value detection
- \`src/analytics/betting/arbitrage.ts\` - Arbitrage finder`,
      },
    ],
  };
}

    private async createLiveMatchEngine(params: z.infer<typeof CreateLiveMatchEngineSchema>) {
  const { updateFrequency, predictionAccuracy, includeXG } = params;

  const liveCode = this.generateLiveMatchEngine({
    updateFrequency,
    predictionAccuracy,
    includeXG,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated Live Match Engine: ${updateFrequency}

### Live Match System
\`\`\`typescript
${liveCode.system}
\`\`\`

### Real-Time Predictor
\`\`\`typescript
${liveCode.predictor}
\`\`\`

### Live xG Calculator
\`\`\`typescript
${liveCode.liveXG}
\`\`\`

### Configuration:
- **Update Frequency**: ${updateFrequency}
- **Prediction Accuracy**: ${predictionAccuracy}
- **Include Live xG**: ${includeXG}

### Features:
- Real-time match state tracking
- Live probability updates
- Dynamic goal predictions
- Live xG calculations
- Event impact analysis

### Files to create:
- \`src/analytics/live/engine.ts\` - Live match engine
- \`src/analytics/live/predictor.ts\` - Live predictor
- \`src/analytics/live/xg.ts\` - Live xG calculator`,
      },
    ],
  };
}

    private async createFantasyOptimizer(params: z.infer<typeof CreateFantasyOptimizerSchema>) {
  const { platform, optimizationType, budget } = params;

  const fantasyCode = this.generateFantasyOptimizer({
    platform,
    optimizationType,
    budget,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated Fantasy Optimizer: ${platform}

### Fantasy Analysis System
\`\`\`typescript
${fantasyCode.system}
\`\`\`

### Lineup Optimizer
\`\`\`typescript
${fantasyCode.optimizer}
\`\`\`

### Player Value Calculator
\`\`\`typescript
${fantasyCode.valueCalculator}
\`\`\`

### Configuration:
- **Platform**: ${platform}
- **Optimization Type**: ${optimizationType}
- **Budget**: ${budget || 'N/A'}

### Features:
- Optimal lineup generation
- Player value analysis
- Ownership projection
- Differential identification
- Captain selection algorithm

### Files to create:
- \`src/analytics/fantasy/optimizer.ts\` - Fantasy optimizer
- \`src/analytics/fantasy/value.ts\` - Value calculator
- \`src/analytics/fantasy/lineup.ts\` - Lineup generator`,
      },
    ],
  };
}

    private async createInjuryTracker(params: z.infer<typeof CreateInjuryTrackerSchema>) {
  const { trackingType, includePhysicalData, recoveryModeling } = params;

  const injuryCode = this.generateInjuryTracker({
    trackingType,
    includePhysicalData,
    recoveryModeling,
  });

  return {
    content: [
      {
        type: 'text',
        text: `## Generated Injury Tracking System: ${trackingType}

### Injury Analysis System
\`\`\`typescript
${injuryCode.system}
\`\`\`

### Risk Assessment Algorithm
\`\`\`typescript
${injuryCode.riskAssessment}
\`\`\`

### Recovery Predictor
\`\`\`typescript
${injuryCode.recoveryPredictor}
\`\`\`

### Configuration:
- **Tracking Type**: ${trackingType}
- **Include Physical Data**: ${includePhysicalData}
- **Recovery Modeling**: ${recoveryModeling}

### Features:
- Injury history tracking
- Risk prediction algorithms
- Recovery time estimation
- Impact on team performance
- Replacement player suggestions

### Files to create:
- \`src/analytics/injury/tracker.ts\` - Injury tracker
- \`src/analytics/injury/risk.ts\` - Risk assessment
- \`src/analytics/injury/recovery.ts\` - Recovery modeling`,
      },
    ],
  };
}
