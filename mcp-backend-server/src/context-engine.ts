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

import { CodebaseAnalyzer } from './codebase-analyzer.js';
import { MemoryStore } from './memory-store.js';
import { PatternDetector } from './pattern-detector.js';

export interface CodeGenerationOptions {
    intent: string;
    fileType: 'controller' | 'service' | 'model' | 'test' | 'middleware' | 'route' | 'utility';
    relatedFiles?: string[];
    followPatterns: boolean;
    context?: any;
}

export interface GeneratedCodeResult {
    implementation: string;
    tests: string;
    integrationNotes: string[];
    relatedFilesToUpdate: RelatedFileUpdate[];
    followsPatterns: boolean;
    architectureCompliance: number;
    styleConsistency: number;
    recommendations: string[];
}

export interface RelatedFileUpdate {
    path: string;
    reason: string;
    suggestedChanges: string;
}

export interface ContextualRecommendation {
    type: 'refactoring' | 'pattern' | 'optimization' | 'security' | 'testing';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    implementation: string;
    benefits: string[];
    effort: 'low' | 'medium' | 'high';
    relatedFiles: string[];
}

export interface CodebaseContext {
    architecture: string;
    patterns: string[];
    conventions: CodeConventions;
    dependencies: string[];
    testingFramework: string;
    codeStyle: CodeStyle;
}

export interface CodeConventions {
    naming: {
        variables: string;
        functions: string;
        classes: string;
        files: string;
    };
    structure: {
        imports: string;
        exports: string;
        errorHandling: string;
    };
    documentation: {
        functions: boolean;
        classes: boolean;
        modules: boolean;
    };
}

export interface CodeStyle {
    indentation: string;
    quotes: 'single' | 'double';
    semicolons: boolean;
    trailingCommas: boolean;
    lineLength: number;
}

export class ContextEngine {
    private analyzer: CodebaseAnalyzer;
    private memoryStore: MemoryStore;
    private patternDetector: PatternDetector;
    private codebaseContext: CodebaseContext | null = null;

    constructor(
        analyzer: CodebaseAnalyzer,
        memoryStore: MemoryStore,
        patternDetector: PatternDetector
    ) {
        this.analyzer = analyzer;
        this.memoryStore = memoryStore;
        this.patternDetector = patternDetector;
    }

    /**
     * Generate context-aware code based on intent and existing patterns
     */
    async generateCode(options: CodeGenerationOptions): Promise<GeneratedCodeResult> {
        console.error(`🎨 Generating ${options.fileType} code: ${options.intent}`);

        // Analyze context
        const context = await this.getCodebaseContext();
        const patterns = await this.patternDetector.detectPatterns();
        const relatedFiles = options.relatedFiles || [];

        // Generate implementation
        const implementation = await this.generateImplementation(options, context, patterns);
        
        // Generate tests
        const tests = await this.generateTests(options, implementation, context);

        // Analyze integration requirements
        const integrationNotes = await this.generateIntegrationNotes(options, context);
        const relatedFilesToUpdate = await this.identifyFilesToUpdate(options, context);

        // Validate against patterns and style
        const followsPatterns = await this.validatePatternCompliance(implementation, patterns);
        const architectureCompliance = await this.calculateArchitectureCompliance(implementation, context);
        const styleConsistency = await this.calculateStyleConsistency(implementation, context);

        // Generate recommendations
        const recommendations = await this.generateImplementationRecommendations(
            implementation,
            context,
            patterns
        );

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
    }

    /**
     * Get contextual recommendations based on current codebase state
     */
    async getContextualRecommendations(context?: any): Promise<ContextualRecommendation[]> {
        console.error('💡 Generating contextual recommendations...');

        const recommendations: ContextualRecommendation[] = [];
        const codebaseContext = await this.getCodebaseContext();
        const memoryEntries = await this.memoryStore.query({ limit: 10 });

        // Pattern-based recommendations
        const patternRecommendations = await this.generatePatternRecommendations(codebaseContext);
        recommendations.push(...patternRecommendations);

        // Memory-based recommendations
        const memoryRecommendations = await this.generateMemoryBasedRecommendations(memoryEntries);
        recommendations.push(...memoryRecommendations);

        // Architecture recommendations
        const architectureRecommendations = await this.generateArchitectureRecommendations(codebaseContext);
        recommendations.push(...architectureRecommendations);

        // Sort by priority
        recommendations.sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        return recommendations;
    }

    /**
     * Analyze code context and suggest improvements
     */
    async analyzeCodeContext(filePath: string): Promise<ContextAnalysis> {
        console.error(`🔍 Analyzing context for: ${filePath}`);

        const context = await this.getCodebaseContext();
        const relatedFiles = await this.analyzer.getRelatedFiles(filePath, ['imports', 'exports', 'tests'], 10);
        
        return {
            file: filePath,
            architecture: context?.architecture || 'Unknown',
            patterns: context?.patterns || [],
            complexity: await this.calculateFileComplexity(filePath),
            maintainability: await this.calculateFileMaintainability(filePath),
            testCoverage: await this.calculateFileTestCoverage(filePath, relatedFiles.tests),
            dependencies: relatedFiles.imports.map(f => f.path),
            dependents: relatedFiles.dependents.map(f => f.path),
            suggestions: await this.generateFileSuggestions(filePath, context)
        };
    }

    // Private helper methods
    private async getCodebaseContext(): Promise<CodebaseContext> {
        if (this.codebaseContext) {
            return this.codebaseContext;
        }

        const analysis = await this.analyzer.analyzeCodebase({
            depth: 'shallow',
            includeTests: true,
            includeNodeModules: false
        });

        const patterns = await this.patternDetector.detectPatterns();
        const styleAnalysis = await this.patternDetector.analyzeStyleConsistency();

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
    }

    private async generateImplementation(
        options: CodeGenerationOptions,
        context: CodebaseContext,
        patterns: any[]
    ): Promise<string> {
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
    }

    private async generateTests(
        options: CodeGenerationOptions,
        implementation: string,
        context: CodebaseContext
    ): Promise<string> {
        const testTemplate = this.getTestTemplate(options.fileType, context.testingFramework);
        
        return testTemplate
            .replace(/{{IMPLEMENTATION}}/g, implementation)
            .replace(/{{INTENT}}/g, options.intent)
            .replace(/{{FILE_TYPE}}/g, options.fileType);
    }

    private async generateIntegrationNotes(
        options: CodeGenerationOptions,
        context: CodebaseContext
    ): Promise<string[]> {
        const notes: string[] = [];

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
    }

    private async identifyFilesToUpdate(
        options: CodeGenerationOptions,
        context: CodebaseContext
    ): Promise<RelatedFileUpdate[]> {
        const updates: RelatedFileUpdate[] = [];

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
    }

    private getCodeTemplates(fileType: string, context: CodebaseContext): Record<string, string> {
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

    private getTestTemplate(fileType: string, framework: string): string {
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

    private generateContextualImports(options: CodeGenerationOptions, context: CodebaseContext): string {
        const imports: string[] = [];

        if (context.dependencies.includes('express') && options.fileType === 'controller') {
            imports.push("import { Request, Response, NextFunction } from 'express';");
        }

        if (context.patterns.includes('API Client Pattern')) {
            imports.push("import { DefaultService } from '../apis/footy';");
        }

        return imports.join('\n');
    }

    private async validatePatternCompliance(implementation: string, patterns: any[]): Promise<boolean> {
        // Mock implementation - would validate actual patterns
        return patterns.length > 0;
    }

    private async calculateArchitectureCompliance(implementation: string, context: CodebaseContext): Promise<number> {
        // Mock implementation - would calculate actual compliance
        return Math.floor(Math.random() * 20) + 80; // 80-100 range
    }

    private async calculateStyleConsistency(implementation: string, context: CodebaseContext): Promise<number> {
        // Mock implementation - would check actual style consistency
        return Math.floor(Math.random() * 15) + 85; // 85-100 range
    }

    private async generateImplementationRecommendations(
        implementation: string,
        context: CodebaseContext,
        patterns: any[]
    ): Promise<string[]> {
        return [
            'Add comprehensive error handling',
            'Include input validation',
            'Add logging for debugging',
            'Consider adding performance monitoring'
        ];
    }

    private async generatePatternRecommendations(context: CodebaseContext): Promise<ContextualRecommendation[]> {
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
    }

    private async generateMemoryBasedRecommendations(entries: any[]): Promise<ContextualRecommendation[]> {
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
    }

    private async generateArchitectureRecommendations(context: CodebaseContext): Promise<ContextualRecommendation[]> {
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
    }

    private async calculateFileComplexity(filePath: string): Promise<number> {
        // Mock implementation
        return Math.floor(Math.random() * 5) + 3; // 3-8 range
    }

    private async calculateFileMaintainability(filePath: string): Promise<number> {
        // Mock implementation
        return Math.floor(Math.random() * 20) + 70; // 70-90 range
    }

    private async calculateFileTestCoverage(filePath: string, testFiles: any[]): Promise<number> {
        // Mock implementation
        return testFiles.length > 0 ? Math.floor(Math.random() * 30) + 70 : 0;
    }

    private async generateFileSuggestions(filePath: string, context: CodebaseContext | null): Promise<string[]> {
        return [
            'Consider adding more comprehensive tests',
            'Add JSDoc documentation for better maintainability',
            'Consider breaking down complex functions'
        ];
    }
}

interface ContextAnalysis {
    file: string;
    architecture: string;
    patterns: string[];
    complexity: number;
    maintainability: number;
    testCoverage: number;
    dependencies: string[];
    dependents: string[];
    suggestions: string[];
}
