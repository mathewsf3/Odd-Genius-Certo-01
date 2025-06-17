#!/usr/bin/env node

/**
 * MCP Codebase Memory & Intelligence Server
 * 
 * Provides comprehensive codebase awareness and memory for GitHub Copilot agents.
 * This server maintains complete knowledge of project structure, patterns, dependencies,
 * and provides intelligent context-aware recommendations.
 * 
 * Features:
 * - Complete codebase structure mapping and real-time monitoring
 * - Intelligent code pattern recognition and analysis
 * - Dependency graph analysis and optimization suggestions
 * - Context-aware code generation and refactoring recommendations
 * - Technical debt tracking and resolution guidance
 * - Integration with existing FootyStats API and OpenAPI specs
 * - Persistent memory system for learning from codebase evolution
 * - Performance bottleneck identification and optimization
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
import * as fs from 'fs';
import * as path from 'path';
import { CodebaseAnalyzer } from './codebase-analyzer.js';
import { MemoryStore } from './memory-store.js';
import { PatternDetector } from './pattern-detector.js';
import { DependencyMapper } from './dependency-mapper.js';
import { ContextEngine } from './context-engine.js';

/**
 * Tool Schemas for Codebase Memory Operations
 */
const AnalyzeCodebaseSchema = z.object({
    depth: z.enum(['shallow', 'deep', 'comprehensive']).default('deep').describe('Analysis depth level'),
    includeTests: z.boolean().default(true).describe('Include test files in analysis'),
    includeNodeModules: z.boolean().default(false).describe('Include node_modules in analysis'),
    focusAreas: z.array(z.enum(['structure', 'patterns', 'dependencies', 'performance', 'security'])).optional().describe('Specific areas to focus analysis on')
});

const GetRelatedFilesSchema = z.object({
    filePath: z.string().describe('Path to the file to find related files for'),
    relationshipTypes: z.array(z.enum(['imports', 'exports', 'tests', 'similar', 'dependent'])).default(['imports', 'exports', 'tests']).describe('Types of relationships to consider'),
    maxResults: z.number().int().min(1).max(50).default(10).describe('Maximum number of related files to return')
});

const SuggestRefactoringSchema = z.object({
    filePath: z.string().optional().describe('Specific file to analyze for refactoring (if not provided, analyzes entire codebase)'),
    refactoringTypes: z.array(z.enum(['extract-function', 'extract-class', 'remove-duplication', 'optimize-imports', 'improve-naming', 'reduce-complexity'])).optional().describe('Types of refactoring to suggest'),
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium').describe('Minimum priority level for suggestions')
});

const ValidatePatternsSchema = z.object({
    patterns: z.array(z.enum(['mvc', 'repository', 'service-layer', 'dto', 'api-client', 'error-handling', 'testing'])).optional().describe('Specific patterns to validate'),
    strictMode: z.boolean().default(false).describe('Enable strict pattern validation'),
    generateReport: z.boolean().default(true).describe('Generate detailed validation report')
});

const GenerateContextCodeSchema = z.object({
    intent: z.string().describe('Description of what code needs to be generated'),
    fileType: z.enum(['controller', 'service', 'model', 'test', 'middleware', 'route', 'utility']).describe('Type of file to generate'),
    relatedFiles: z.array(z.string()).optional().describe('Related files to consider for context'),
    followPatterns: z.boolean().default(true).describe('Follow existing codebase patterns')
});

const TrackTechnicalDebtSchema = z.object({
    category: z.enum(['code-smells', 'security', 'performance', 'maintainability', 'documentation', 'testing']).optional().describe('Specific category of technical debt to track'),
    severity: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Minimum severity level to report'),
    includeMetrics: z.boolean().default(true).describe('Include quantitative metrics in the report')
});

const OptimizeDependenciesSchema = z.object({
    analysisType: z.enum(['unused', 'outdated', 'security', 'bundle-size', 'conflicts']).default('unused').describe('Type of dependency analysis to perform'),
    includeDevDependencies: z.boolean().default(true).describe('Include dev dependencies in analysis'),
    suggestAlternatives: z.boolean().default(true).describe('Suggest alternative packages when applicable')
});

/**
 * Main MCP Server for Codebase Memory & Intelligence
 */
export class CodebaseMemoryMCPServer {
    private server: Server;
    private analyzer: CodebaseAnalyzer;
    private memoryStore: MemoryStore;
    private patternDetector: PatternDetector;
    private dependencyMapper: DependencyMapper;
    private contextEngine: ContextEngine;
    private projectRoot: string;

    constructor(projectRoot: string = process.cwd()) {
        this.server = new Server({
            name: 'codebase-memory-intelligence-server',
            version: '1.0.0'
        });

        this.projectRoot = path.resolve(projectRoot);

        // Initialize core components
        this.analyzer = new CodebaseAnalyzer(this.projectRoot);
        this.memoryStore = new MemoryStore(path.join(this.projectRoot, '.mcp-memory'));
        this.patternDetector = new PatternDetector(this.projectRoot);
        this.dependencyMapper = new DependencyMapper(this.projectRoot);
        this.contextEngine = new ContextEngine(this.analyzer, this.memoryStore, this.patternDetector);

        this.setupToolHandlers();
        this.setupErrorHandling();
        this.initializeCodebaseMonitoring();
    }

    private setupToolHandlers() {
        // List all available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const tools = [
                {
                    name: 'analyze_codebase_structure',
                    description: 'Perform comprehensive analysis of codebase structure, patterns, and architecture',
                    inputSchema: AnalyzeCodebaseSchema
                },
                {
                    name: 'get_related_files',
                    description: 'Find files related to a given file through imports, exports, tests, or similarity',
                    inputSchema: GetRelatedFilesSchema
                },
                {
                    name: 'suggest_refactoring_opportunities',
                    description: 'Identify and suggest refactoring opportunities to improve code quality',
                    inputSchema: SuggestRefactoringSchema
                },
                {
                    name: 'validate_coding_patterns',
                    description: 'Validate adherence to established coding patterns and architectural principles',
                    inputSchema: ValidatePatternsSchema
                },
                {
                    name: 'generate_context_aware_code',
                    description: 'Generate code that follows existing patterns and integrates seamlessly with the codebase',
                    inputSchema: GenerateContextCodeSchema
                },
                {
                    name: 'track_technical_debt',
                    description: 'Identify, categorize, and track technical debt across the codebase',
                    inputSchema: TrackTechnicalDebtSchema
                },
                {
                    name: 'optimize_dependencies',
                    description: 'Analyze and optimize project dependencies for security, performance, and maintainability',
                    inputSchema: OptimizeDependenciesSchema
                }
            ];

            console.error(`📋 Listing ${tools.length} Codebase Memory & Intelligence tools`);
            return { tools };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                switch (name) {
                    case 'analyze_codebase_structure':
                        return await this.handleAnalyzeCodebase(AnalyzeCodebaseSchema.parse(args));

                    case 'get_related_files':
                        return await this.handleGetRelatedFiles(GetRelatedFilesSchema.parse(args));

                    case 'suggest_refactoring_opportunities':
                        return await this.handleSuggestRefactoring(SuggestRefactoringSchema.parse(args));

                    case 'validate_coding_patterns':
                        return await this.handleValidatePatterns(ValidatePatternsSchema.parse(args));

                    case 'generate_context_aware_code':
                        return await this.handleGenerateContextCode(GenerateContextCodeSchema.parse(args));

                    case 'track_technical_debt':
                        return await this.handleTrackTechnicalDebt(TrackTechnicalDebtSchema.parse(args));

                    case 'optimize_dependencies':
                        return await this.handleOptimizeDependencies(OptimizeDependenciesSchema.parse(args));

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

    private setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error('[Codebase Memory MCP Error]', error);
        };

        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    private async initializeCodebaseMonitoring() {
        console.error('🔍 Initializing codebase monitoring...');
        // Initial codebase scan will be implemented
    }

    /**
     * Handler Methods for Tool Operations
     */
    private async handleAnalyzeCodebase(args: z.infer<typeof AnalyzeCodebaseSchema>) {
        console.error(`🔍 Analyzing codebase with depth: ${args.depth}`);

        const analysis = await this.analyzer.analyzeCodebase({
            depth: args.depth,
            includeTests: args.includeTests,
            includeNodeModules: args.includeNodeModules,
            focusAreas: args.focusAreas
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `## 🧠 Codebase Structure Analysis

### 📊 Project Overview
- **Total Files**: ${analysis.totalFiles}
- **Lines of Code**: ${analysis.totalLinesOfCode}
- **Languages**: ${analysis.languages.join(', ')}
- **Architecture Pattern**: ${analysis.architecturePattern}

### 🏗️ Directory Structure
${analysis.directoryStructure.map(dir => `- **${dir.path}**: ${dir.fileCount} files (${dir.purpose})`).join('\n')}

### 🔗 Key Dependencies
${analysis.keyDependencies.map(dep => `- **${dep.name}** (${dep.version}): ${dep.usage}`).join('\n')}

### 📈 Code Quality Metrics
- **Complexity Score**: ${analysis.complexityScore}/10
- **Maintainability Index**: ${analysis.maintainabilityIndex}/100
- **Test Coverage**: ${analysis.testCoverage}%
- **Technical Debt**: ${analysis.technicalDebtHours} hours

### 🎯 Key Insights
${analysis.insights.map(insight => `- ${insight}`).join('\n')}

### 🚀 Recommendations
${analysis.recommendations.map(rec => `- **${rec.priority}**: ${rec.description}`).join('\n')}`
                }
            ]
        };
    }

    private async handleGetRelatedFiles(args: z.infer<typeof GetRelatedFilesSchema>) {
        console.error(`🔗 Finding related files for: ${args.filePath}`);

        const relatedFiles = await this.analyzer.getRelatedFiles(
            args.filePath,
            args.relationshipTypes,
            args.maxResults
        );

        return {
            content: [
                {
                    type: 'text',
                    text: `## 🔗 Related Files for \`${args.filePath}\`

### 📁 Direct Dependencies (${relatedFiles.imports.length})
${relatedFiles.imports.map(file => `- **${file.path}** - ${file.relationship}`).join('\n')}

### 📤 Dependents (${relatedFiles.dependents.length})
${relatedFiles.dependents.map(file => `- **${file.path}** - ${file.relationship}`).join('\n')}

### 🧪 Test Files (${relatedFiles.tests.length})
${relatedFiles.tests.map(file => `- **${file.path}** - ${file.coverage}% coverage`).join('\n')}

### 🔄 Similar Files (${relatedFiles.similar.length})
${relatedFiles.similar.map(file => `- **${file.path}** - ${file.similarity}% similar`).join('\n')}

### 💡 Integration Suggestions
${relatedFiles.suggestions.map(suggestion => `- ${suggestion}`).join('\n')}`
                }
            ]
        };
    }

    private async handleSuggestRefactoring(args: z.infer<typeof SuggestRefactoringSchema>) {
        console.error(`🔧 Analyzing refactoring opportunities${args.filePath ? ` for: ${args.filePath}` : ' (entire codebase)'}`);

        const suggestions = await this.analyzer.suggestRefactoring({
            filePath: args.filePath,
            refactoringTypes: args.refactoringTypes,
            priority: args.priority
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `## 🔧 Refactoring Opportunities

### 🎯 High Priority Suggestions (${suggestions.high.length})
${suggestions.high.map(s => `- **${s.type}** in \`${s.file}\`: ${s.description}\n  - Impact: ${s.impact}\n  - Effort: ${s.effort}`).join('\n\n')}

### 📈 Medium Priority Suggestions (${suggestions.medium.length})
${suggestions.medium.map(s => `- **${s.type}** in \`${s.file}\`: ${s.description}`).join('\n')}

### 💡 Code Quality Improvements
${suggestions.codeQuality.map(improvement => `- ${improvement}`).join('\n')}

### 🚀 Implementation Guide
${suggestions.implementationSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`
                }
            ]
        };
    }

    private async handleValidatePatterns(args: z.infer<typeof ValidatePatternsSchema>) {
        console.error(`✅ Validating coding patterns${args.patterns ? ` for: ${args.patterns.join(', ')}` : ''}`);

        const validation = await this.patternDetector.validatePatterns({
            patterns: args.patterns,
            strictMode: args.strictMode,
            generateReport: args.generateReport
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `## ✅ Coding Pattern Validation

### 📊 Overall Score: ${validation.overallScore}/100

### 🎯 Pattern Compliance
${validation.patterns.map(p => `- **${p.name}**: ${p.compliance}% compliant (${p.violations} violations)`).join('\n')}

### ⚠️ Pattern Violations (${validation.violations.length})
${validation.violations.map(v => `- **${v.pattern}** in \`${v.file}:${v.line}\`: ${v.description}\n  - Severity: ${v.severity}\n  - Fix: ${v.suggestedFix}`).join('\n\n')}

### 🏆 Best Practices Found
${validation.bestPractices.map(bp => `- ${bp}`).join('\n')}

### 🚀 Improvement Recommendations
${validation.recommendations.map(rec => `- ${rec}`).join('\n')}`
                }
            ]
        };
    }

    private async handleGenerateContextCode(args: z.infer<typeof GenerateContextCodeSchema>) {
        console.error(`🎨 Generating ${args.fileType} code for: ${args.intent}`);

        const generatedCode = await this.contextEngine.generateCode({
            intent: args.intent,
            fileType: args.fileType,
            relatedFiles: args.relatedFiles,
            followPatterns: args.followPatterns
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `## 🎨 Generated ${args.fileType.toUpperCase()} Code

### 📝 Intent: ${args.intent}

### 🚀 Generated Implementation
\`\`\`typescript
${generatedCode.implementation}
\`\`\`

### 🧪 Generated Tests
\`\`\`typescript
${generatedCode.tests}
\`\`\`

### 📋 Integration Notes
${generatedCode.integrationNotes.map(note => `- ${note}`).join('\n')}

### 🔗 Related Files to Update
${generatedCode.relatedFilesToUpdate.map(file => `- **${file.path}**: ${file.reason}`).join('\n')}

### 🎯 Pattern Compliance
- Follows existing patterns: ${generatedCode.followsPatterns ? '✅' : '❌'}
- Architecture compliance: ${generatedCode.architectureCompliance}%
- Code style consistency: ${generatedCode.styleConsistency}%`
                }
            ]
        };
    }

    private async handleTrackTechnicalDebt(args: z.infer<typeof TrackTechnicalDebtSchema>) {
        console.error(`📊 Tracking technical debt${args.category ? ` for category: ${args.category}` : ''}`);

        const debtAnalysis = await this.analyzer.analyzeTechnicalDebt({
            category: args.category,
            severity: args.severity,
            includeMetrics: args.includeMetrics
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `## 📊 Technical Debt Analysis

### 🎯 Overall Debt Score: ${debtAnalysis.overallScore}/100
- **Total Debt Hours**: ${debtAnalysis.totalHours}
- **Monthly Interest**: ${debtAnalysis.monthlyInterest} hours
- **Payback Priority**: ${debtAnalysis.paybackPriority}

### 📈 Debt by Category
${debtAnalysis.categories.map(cat => `- **${cat.name}**: ${cat.hours} hours (${cat.percentage}%)`).join('\n')}

### 🚨 Critical Issues (${debtAnalysis.critical.length})
${debtAnalysis.critical.map(issue => `- **${issue.file}**: ${issue.description}\n  - Impact: ${issue.impact}\n  - Effort to fix: ${issue.effort}`).join('\n\n')}

### ⚠️ High Priority Issues (${debtAnalysis.high.length})
${debtAnalysis.high.map(issue => `- **${issue.file}**: ${issue.description}`).join('\n')}

### 🎯 Recommended Actions
${debtAnalysis.recommendations.map((rec, index) => `${index + 1}. ${rec.action} (${rec.impact})`).join('\n')}`
                }
            ]
        };
    }

    private async handleOptimizeDependencies(args: z.infer<typeof OptimizeDependenciesSchema>) {
        console.error(`📦 Analyzing dependencies for: ${args.analysisType}`);

        const depAnalysis = await this.dependencyMapper.analyzeDependencies({
            analysisType: args.analysisType,
            includeDevDependencies: args.includeDevDependencies,
            suggestAlternatives: args.suggestAlternatives
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `## 📦 Dependency Analysis: ${args.analysisType.toUpperCase()}

### 📊 Summary
- **Total Dependencies**: ${depAnalysis.totalDependencies}
- **Issues Found**: ${depAnalysis.issuesFound}
- **Potential Savings**: ${depAnalysis.potentialSavings}

### 🚨 Critical Issues (${depAnalysis.critical.length})
${depAnalysis.critical.map(issue => `- **${issue.package}**: ${issue.description}\n  - Risk: ${issue.risk}\n  - Action: ${issue.recommendedAction}`).join('\n\n')}

### ⚠️ Warnings (${depAnalysis.warnings.length})
${depAnalysis.warnings.map(warning => `- **${warning.package}**: ${warning.description}`).join('\n')}

### 💡 Optimization Opportunities
${depAnalysis.optimizations.map(opt => `- **${opt.package}**: ${opt.suggestion}\n  - Benefit: ${opt.benefit}`).join('\n\n')}

### 🔄 Alternative Suggestions
${depAnalysis.alternatives.map(alt => `- Replace **${alt.current}** with **${alt.suggested}**\n  - Reason: ${alt.reason}`).join('\n\n')}`
                }
            ]
        };
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);

        console.error('🧠 Codebase Memory & Intelligence MCP Server started');
        console.error(`📊 Monitoring project: ${this.projectRoot}`);
        console.error('🎯 Complete codebase awareness and intelligent recommendations ready!');
    }
}

// Start the server
const projectRoot = process.argv[2] || process.cwd();
const server = new CodebaseMemoryMCPServer(projectRoot);
server.run().catch(console.error);
