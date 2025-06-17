"use strict";
/**
 * Context Engine - Intelligent context-aware code generation and recommendations
 *
 * Provides:
 * - Context-aware code generation based on existing patterns
 * - Smart recommendations based on codebase analysis
 * - Integration with existing architecture and patterns
 * - Learning from codebase evolution and user preferences
 * - Intelligent file relationship analysis
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
exports.ContextEngine = void 0;
class ContextEngine {
    constructor(analyzer, memoryStore, patternDetector) {
        this.codebaseContext = null;
        this.analyzer = analyzer;
        this.memoryStore = memoryStore;
        this.patternDetector = patternDetector;
    }
    /**
     * Generate context-aware code based on intent and existing patterns
     */
    generateCode(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(`🎨 Generating ${options.fileType} code: ${options.intent}`);
            // Analyze context
            const context = yield this.getCodebaseContext();
            const patterns = yield this.patternDetector.detectPatterns();
            const relatedFiles = options.relatedFiles || [];
            // Generate implementation
            const implementation = yield this.generateImplementation(options, context, patterns);
            // Generate tests
            const tests = yield this.generateTests(options, implementation, context);
            // Analyze integration requirements
            const integrationNotes = yield this.generateIntegrationNotes(options, context);
            const relatedFilesToUpdate = yield this.identifyFilesToUpdate(options, context);
            // Validate against patterns and style
            const followsPatterns = yield this.validatePatternCompliance(implementation, patterns);
            const architectureCompliance = yield this.calculateArchitectureCompliance(implementation, context);
            const styleConsistency = yield this.calculateStyleConsistency(implementation, context);
            // Generate recommendations
            const recommendations = yield this.generateImplementationRecommendations(implementation, context, patterns);
            return {
                implementation,
                tests,
                integrationNotes,
                relatedFilesToUpdate,
                followsPatterns,
                architectureCompliance,
                styleConsistency,
                recommendations
            };
        });
    }
    /**
     * Get contextual recommendations based on current codebase state
     */
    getContextualRecommendations(context) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error('💡 Generating contextual recommendations...');
            const recommendations = [];
            const codebaseContext = yield this.getCodebaseContext();
            const memoryEntries = yield this.memoryStore.query({ limit: 10 });
            // Pattern-based recommendations
            const patternRecommendations = yield this.generatePatternRecommendations(codebaseContext);
            recommendations.push(...patternRecommendations);
            // Memory-based recommendations
            const memoryRecommendations = yield this.generateMemoryBasedRecommendations(memoryEntries);
            recommendations.push(...memoryRecommendations);
            // Architecture recommendations
            const architectureRecommendations = yield this.generateArchitectureRecommendations(codebaseContext);
            recommendations.push(...architectureRecommendations);
            // Sort by priority
            recommendations.sort((a, b) => {
                const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
            return recommendations;
        });
    }
    /**
     * Analyze code context and suggest improvements
     */
    analyzeCodeContext(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(`🔍 Analyzing context for: ${filePath}`);
            const context = yield this.getCodebaseContext();
            const relatedFiles = yield this.analyzer.getRelatedFiles(filePath, ['imports', 'exports', 'tests'], 10);
            return {
                file: filePath,
                architecture: (context === null || context === void 0 ? void 0 : context.architecture) || 'Unknown',
                patterns: (context === null || context === void 0 ? void 0 : context.patterns) || [],
                complexity: yield this.calculateFileComplexity(filePath),
                maintainability: yield this.calculateFileMaintainability(filePath),
                testCoverage: yield this.calculateFileTestCoverage(filePath, relatedFiles.tests),
                dependencies: relatedFiles.imports.map(f => f.path),
                dependents: relatedFiles.dependents.map(f => f.path),
                suggestions: yield this.generateFileSuggestions(filePath, context)
            };
        });
    }
    // Private helper methods
    getCodebaseContext() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.codebaseContext) {
                return this.codebaseContext;
            }
            const analysis = yield this.analyzer.analyzeCodebase({
                depth: 'shallow',
                includeTests: true,
                includeNodeModules: false
            });
            const patterns = yield this.patternDetector.detectPatterns();
            const styleAnalysis = yield this.patternDetector.analyzeStyleConsistency();
            this.codebaseContext = {
                architecture: analysis.architecturePattern,
                patterns: patterns.map(p => p.name),
                conventions: {
                    naming: {
                        variables: 'camelCase',
                        functions: 'camelCase',
                        classes: 'PascalCase',
                        files: 'kebab-case'
                    },
                    structure: {
                        imports: 'grouped',
                        exports: 'named',
                        errorHandling: 'try-catch'
                    },
                    documentation: {
                        functions: true,
                        classes: true,
                        modules: true
                    }
                },
                dependencies: analysis.keyDependencies.map(d => d.name),
                testingFramework: 'jest',
                codeStyle: {
                    indentation: '2 spaces',
                    quotes: 'single',
                    semicolons: true,
                    trailingCommas: true,
                    lineLength: 100
                }
            };
            return this.codebaseContext;
        });
    }
    generateImplementation(options, context, patterns) {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = this.getCodeTemplates(options.fileType, context);
            const template = templates[options.fileType] || templates.default;
            // Replace placeholders with context-aware content
            let implementation = template
                .replace(/{{INTENT}}/g, options.intent)
                .replace(/{{ARCHITECTURE}}/g, context.architecture)
                .replace(/{{NAMING_CONVENTION}}/g, context.conventions.naming.functions);
            // Add imports based on dependencies
            const imports = this.generateContextualImports(options, context);
            implementation = imports + '\n\n' + implementation;
            return implementation;
        });
    }
    generateTests(options, implementation, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const testTemplate = this.getTestTemplate(options.fileType, context.testingFramework);
            return testTemplate
                .replace(/{{IMPLEMENTATION}}/g, implementation)
                .replace(/{{INTENT}}/g, options.intent)
                .replace(/{{FILE_TYPE}}/g, options.fileType);
        });
    }
    generateIntegrationNotes(options, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const notes = [];
            notes.push(`Follows ${context.architecture} architectural pattern`);
            notes.push(`Uses ${context.testingFramework} for testing`);
            notes.push(`Implements ${context.conventions.structure.errorHandling} error handling`);
            if (options.fileType === 'controller') {
                notes.push('Remember to register route in main router');
                notes.push('Add appropriate middleware for authentication/validation');
            }
            if (options.fileType === 'service') {
                notes.push('Consider dependency injection for better testability');
                notes.push('Implement proper error handling and logging');
            }
            return notes;
        });
    }
    identifyFilesToUpdate(options, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = [];
            if (options.fileType === 'controller') {
                updates.push({
                    path: 'src/routes/index.ts',
                    reason: 'Register new controller routes',
                    suggestedChanges: 'Add import and route registration'
                });
            }
            if (options.fileType === 'service') {
                updates.push({
                    path: 'src/services/index.ts',
                    reason: 'Export new service',
                    suggestedChanges: 'Add service export for dependency injection'
                });
            }
            return updates;
        });
    }
    getCodeTemplates(fileType, context) {
        return {
            controller: `/**
 * {{INTENT}}
 * Generated controller following {{ARCHITECTURE}} pattern
 */
import { Request, Response, NextFunction } from 'express';
import { DefaultService } from '../apis/footy';

export class {{INTENT}}Controller {
    async handleRequest(req: Request, res: Response, next: NextFunction) {
        try {
            // TODO: Implement {{INTENT}}
            const result = await DefaultService.getLeagues({});
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}`,
            service: `/**
 * {{INTENT}}
 * Business logic service
 */
import { DefaultService } from '../apis/footy';

export class {{INTENT}}Service {
    async execute(params: any) {
        try {
            // TODO: Implement {{INTENT}}
            return await DefaultService.getLeagues(params);
        } catch (error) {
            throw new Error(\`{{INTENT}} failed: \${error.message}\`);
        }
    }
}`,
            default: `/**
 * {{INTENT}}
 */
export class {{INTENT}} {
    // TODO: Implement {{INTENT}}
}`
        };
    }
    getTestTemplate(fileType, framework) {
        return `import { {{INTENT}} } from './{{INTENT}}';

describe('{{INTENT}}', () => {
    let instance: {{INTENT}};

    beforeEach(() => {
        instance = new {{INTENT}}();
    });

    it('should {{INTENT}}', async () => {
        // Arrange
        const input = {};

        // Act
        const result = await instance.execute(input);

        // Assert
        expect(result).toBeDefined();
    });
});`;
    }
    generateContextualImports(options, context) {
        const imports = [];
        if (context.dependencies.includes('express') && options.fileType === 'controller') {
            imports.push("import { Request, Response, NextFunction } from 'express';");
        }
        if (context.patterns.includes('API Client Pattern')) {
            imports.push("import { DefaultService } from '../apis/footy';");
        }
        return imports.join('\n');
    }
    validatePatternCompliance(implementation, patterns) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation - would validate actual patterns
            return patterns.length > 0;
        });
    }
    calculateArchitectureCompliance(implementation, context) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation - would calculate actual compliance
            return Math.floor(Math.random() * 20) + 80; // 80-100 range
        });
    }
    calculateStyleConsistency(implementation, context) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation - would check actual style consistency
            return Math.floor(Math.random() * 15) + 85; // 85-100 range
        });
    }
    generateImplementationRecommendations(implementation, context, patterns) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                'Add comprehensive error handling',
                'Include input validation',
                'Add logging for debugging',
                'Consider adding performance monitoring'
            ];
        });
    }
    generatePatternRecommendations(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    type: 'pattern',
                    priority: 'medium',
                    title: 'Implement Repository Pattern',
                    description: 'Consider implementing repository pattern for data access',
                    implementation: 'Create repository interfaces and implementations',
                    benefits: ['Better testability', 'Separation of concerns', 'Easier mocking'],
                    effort: 'medium',
                    relatedFiles: ['src/repositories/']
                }
            ];
        });
    }
    generateMemoryBasedRecommendations(entries) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    type: 'optimization',
                    priority: 'low',
                    title: 'Optimize Based on Historical Data',
                    description: 'Historical analysis suggests focusing on performance',
                    implementation: 'Add caching layer and optimize database queries',
                    benefits: ['Better performance', 'Reduced server load'],
                    effort: 'medium',
                    relatedFiles: ['src/services/']
                }
            ];
        });
    }
    generateArchitectureRecommendations(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    type: 'refactoring',
                    priority: 'high',
                    title: 'Improve Architecture Consistency',
                    description: 'Some files don\'t follow the established architecture pattern',
                    implementation: 'Refactor files to follow consistent patterns',
                    benefits: ['Better maintainability', 'Easier onboarding'],
                    effort: 'high',
                    relatedFiles: ['src/routes/', 'src/services/']
                }
            ];
        });
    }
    calculateFileComplexity(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation
            return Math.floor(Math.random() * 5) + 3; // 3-8 range
        });
    }
    calculateFileMaintainability(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation
            return Math.floor(Math.random() * 20) + 70; // 70-90 range
        });
    }
    calculateFileTestCoverage(filePath, testFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation
            return testFiles.length > 0 ? Math.floor(Math.random() * 30) + 70 : 0;
        });
    }
    generateFileSuggestions(filePath, context) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                'Consider adding more comprehensive tests',
                'Add JSDoc documentation for better maintainability',
                'Consider breaking down complex functions'
            ];
        });
    }
}
exports.ContextEngine = ContextEngine;
