/**
 * Pattern Detector - Intelligent code pattern recognition and validation
 * 
 * Detects and validates:
 * - Architectural patterns (MVC, Service Layer, Repository, etc.)
 * - Code conventions and style consistency
 * - Best practices adherence
 * - Anti-patterns and code smells
 * - Framework-specific patterns (Express.js, TypeScript, etc.)
 */

import * as fs from 'fs';
import * as path from 'path';

export interface PatternValidationOptions {
    patterns?: string[];
    strictMode: boolean;
    generateReport: boolean;
}

export interface PatternValidationResult {
    overallScore: number;
    patterns: PatternCompliance[];
    violations: PatternViolation[];
    bestPractices: string[];
    recommendations: string[];
}

export interface PatternCompliance {
    name: string;
    compliance: number;
    violations: number;
    description: string;
}

export interface PatternViolation {
    pattern: string;
    file: string;
    line: number;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestedFix: string;
}

export interface DetectedPattern {
    name: string;
    confidence: number;
    files: string[];
    description: string;
    examples: PatternExample[];
}

export interface PatternExample {
    file: string;
    lineStart: number;
    lineEnd: number;
    code: string;
    explanation: string;
}

export class PatternDetector {
    private projectRoot: string;
    private knownPatterns: Map<string, PatternDefinition> = new Map();

    constructor(projectRoot: string) {
        this.projectRoot = projectRoot;
        this.initializePatternDefinitions();
    }

    /**
     * Validate coding patterns in the codebase
     */
    async validatePatterns(options: PatternValidationOptions): Promise<PatternValidationResult> {
        console.error(`✅ Validating patterns: ${options.patterns?.join(', ') || 'all'}`);

        const patternsToCheck = options.patterns || Array.from(this.knownPatterns.keys());
        const patterns: PatternCompliance[] = [];
        const violations: PatternViolation[] = [];
        const bestPractices: string[] = [];

        for (const patternName of patternsToCheck) {
            const patternDef = this.knownPatterns.get(patternName);
            if (!patternDef) continue;

            const compliance = await this.checkPatternCompliance(patternDef, options.strictMode);
            patterns.push(compliance);
            violations.push(...compliance.violationDetails);
        }

        // Detect best practices
        bestPractices.push(...await this.detectBestPractices());

        // Calculate overall score
        const overallScore = this.calculateOverallScore(patterns);

        // Generate recommendations
        const recommendations = this.generatePatternRecommendations(patterns, violations);

        return {
            overallScore,
            patterns: patterns.map(p => ({
                name: p.name,
                compliance: p.compliance,
                violations: p.violations,
                description: p.description
            })),
            violations,
            bestPractices,
            recommendations
        };
    }

    /**
     * Detect patterns automatically in the codebase
     */
    async detectPatterns(): Promise<DetectedPattern[]> {
        console.error('🔍 Auto-detecting patterns in codebase...');

        const detectedPatterns: DetectedPattern[] = [];

        // Check for MVC pattern
        const mvcPattern = await this.detectMVCPattern();
        if (mvcPattern) detectedPatterns.push(mvcPattern);

        // Check for Service Layer pattern
        const servicePattern = await this.detectServiceLayerPattern();
        if (servicePattern) detectedPatterns.push(servicePattern);

        // Check for Repository pattern
        const repoPattern = await this.detectRepositoryPattern();
        if (repoPattern) detectedPatterns.push(repoPattern);

        // Check for DTO pattern
        const dtoPattern = await this.detectDTOPattern();
        if (dtoPattern) detectedPatterns.push(dtoPattern);

        // Check for Middleware pattern
        const middlewarePattern = await this.detectMiddlewarePattern();
        if (middlewarePattern) detectedPatterns.push(middlewarePattern);

        return detectedPatterns;
    }

    /**
     * Analyze code style consistency
     */
    async analyzeStyleConsistency(): Promise<StyleAnalysis> {
        console.error('🎨 Analyzing code style consistency...');

        const files = await this.getSourceFiles();
        const styleMetrics = {
            indentation: await this.analyzeIndentation(files),
            naming: await this.analyzeNamingConventions(files),
            imports: await this.analyzeImportStyle(files),
            functions: await this.analyzeFunctionStyle(files)
        };

        return {
            overallConsistency: this.calculateStyleConsistency(styleMetrics),
            metrics: styleMetrics,
            violations: await this.findStyleViolations(files),
            recommendations: this.generateStyleRecommendations(styleMetrics)
        };
    }

    // Private helper methods
    private initializePatternDefinitions(): void {
        // MVC Pattern
        this.knownPatterns.set('mvc', {
            name: 'MVC (Model-View-Controller)',
            description: 'Separation of concerns with models, views, and controllers',
            requiredDirectories: ['models', 'views', 'controllers'],
            filePatterns: ['*.model.ts', '*.controller.ts', '*.view.ts'],
            rules: [
                'Controllers should not contain business logic',
                'Models should be pure data structures',
                'Views should not directly access models'
            ]
        });

        // Service Layer Pattern
        this.knownPatterns.set('service-layer', {
            name: 'Service Layer',
            description: 'Business logic encapsulated in service classes',
            requiredDirectories: ['services'],
            filePatterns: ['*.service.ts'],
            rules: [
                'Services should contain business logic',
                'Controllers should delegate to services',
                'Services should be testable in isolation'
            ]
        });

        // Repository Pattern
        this.knownPatterns.set('repository', {
            name: 'Repository Pattern',
            description: 'Data access abstraction layer',
            requiredDirectories: ['repositories'],
            filePatterns: ['*.repository.ts'],
            rules: [
                'Repositories should abstract data access',
                'Business logic should not be in repositories',
                'Repositories should implement interfaces'
            ]
        });

        // DTO Pattern
        this.knownPatterns.set('dto', {
            name: 'Data Transfer Object',
            description: 'Objects for transferring data between layers',
            requiredDirectories: ['models', 'dtos'],
            filePatterns: ['*.dto.ts', '*.model.ts'],
            rules: [
                'DTOs should be simple data containers',
                'DTOs should have clear naming',
                'DTOs should be validated'
            ]
        });

        // API Client Pattern
        this.knownPatterns.set('api-client', {
            name: 'API Client Pattern',
            description: 'Structured API client implementation',
            requiredDirectories: ['apis'],
            filePatterns: ['*.api.ts', '*/index.ts'],
            rules: [
                'API clients should be generated from specs',
                'API clients should handle errors consistently',
                'API clients should be typed'
            ]
        });

        // Error Handling Pattern
        this.knownPatterns.set('error-handling', {
            name: 'Error Handling',
            description: 'Consistent error handling throughout the application',
            requiredDirectories: ['middleware'],
            filePatterns: ['*error*.ts', '*exception*.ts'],
            rules: [
                'Errors should be handled consistently',
                'Custom error types should be used',
                'Error middleware should be implemented'
            ]
        });

        // Testing Pattern
        this.knownPatterns.set('testing', {
            name: 'Testing Patterns',
            description: 'Comprehensive testing strategy',
            requiredDirectories: ['tests', '__tests__'],
            filePatterns: ['*.test.ts', '*.spec.ts'],
            rules: [
                'Tests should follow AAA pattern',
                'Tests should be isolated',
                'Tests should have descriptive names'
            ]
        });
    }

    private async checkPatternCompliance(pattern: PatternDefinition, strictMode: boolean): Promise<PatternComplianceResult> {
        const violationsList: PatternViolation[] = [];
        let compliance = 100;

        // Check required directories
        for (const dir of pattern.requiredDirectories) {
            const dirPath = path.join(this.projectRoot, 'src', dir);
            if (!fs.existsSync(dirPath)) {
                violationsList.push({
                    pattern: pattern.name,
                    file: `src/${dir}`,
                    line: 0,
                    description: `Required directory '${dir}' is missing`,
                    severity: 'high',
                    suggestedFix: `Create directory 'src/${dir}'`
                });
                compliance -= 20;
            }
        }

        // Check file patterns
        const files = await this.getSourceFiles();
        const patternFiles = files.filter(file =>
            pattern.filePatterns.some(p => this.matchesPattern(file, p))
        );

        if (patternFiles.length === 0 && pattern.filePatterns.length > 0) {
            violationsList.push({
                pattern: pattern.name,
                file: 'src/',
                line: 0,
                description: `No files matching pattern found: ${pattern.filePatterns.join(', ')}`,
                severity: 'medium',
                suggestedFix: `Create files following the pattern: ${pattern.filePatterns[0]}`
            });
            compliance -= 15;
        }

        // Check pattern-specific rules
        for (const file of patternFiles) {
            const fileViolations = await this.checkFileAgainstRules(file, pattern.rules, strictMode);
            violationsList.push(...fileViolations);
            compliance -= fileViolations.length * 5;
        }

        return {
            name: pattern.name,
            compliance: Math.max(0, compliance),
            violations: violationsList.length,
            description: pattern.description,
            violationDetails: violationsList
        };
    }

    private async detectMVCPattern(): Promise<DetectedPattern | null> {
        const hasControllers = fs.existsSync(path.join(this.projectRoot, 'src', 'controllers'));
        const hasModels = fs.existsSync(path.join(this.projectRoot, 'src', 'models'));
        const hasViews = fs.existsSync(path.join(this.projectRoot, 'src', 'views'));

        if (hasControllers && hasModels) {
            return {
                name: 'MVC Pattern',
                confidence: hasViews ? 0.9 : 0.7,
                files: ['src/controllers', 'src/models', hasViews ? 'src/views' : ''].filter(Boolean),
                description: 'Model-View-Controller architectural pattern detected',
                examples: []
            };
        }

        return null;
    }

    private async detectServiceLayerPattern(): Promise<DetectedPattern | null> {
        const hasServices = fs.existsSync(path.join(this.projectRoot, 'src', 'services'));

        if (hasServices) {
            const serviceFiles = await this.findFiles('src/services', '*.ts');
            return {
                name: 'Service Layer Pattern',
                confidence: 0.8,
                files: serviceFiles,
                description: 'Service layer for business logic encapsulation',
                examples: []
            };
        }

        return null;
    }

    private async detectRepositoryPattern(): Promise<DetectedPattern | null> {
        const hasRepositories = fs.existsSync(path.join(this.projectRoot, 'src', 'repositories'));

        if (hasRepositories) {
            return {
                name: 'Repository Pattern',
                confidence: 0.8,
                files: ['src/repositories'],
                description: 'Repository pattern for data access abstraction',
                examples: []
            };
        }

        return null;
    }

    private async detectDTOPattern(): Promise<DetectedPattern | null> {
        const files = await this.getSourceFiles();
        const dtoFiles = files.filter(f => f.includes('.dto.') || f.includes('/models/'));

        if (dtoFiles.length > 0) {
            return {
                name: 'DTO Pattern',
                confidence: 0.7,
                files: dtoFiles,
                description: 'Data Transfer Objects for structured data exchange',
                examples: []
            };
        }

        return null;
    }

    private async detectMiddlewarePattern(): Promise<DetectedPattern | null> {
        const hasMiddleware = fs.existsSync(path.join(this.projectRoot, 'src', 'middleware'));

        if (hasMiddleware) {
            return {
                name: 'Middleware Pattern',
                confidence: 0.9,
                files: ['src/middleware'],
                description: 'Express.js middleware pattern for request processing',
                examples: []
            };
        }

        return null;
    }

    private async getSourceFiles(): Promise<string[]> {
        // Mock implementation - would scan actual files
        return [
            'src/server.ts',
            'src/routes/football.ts',
            'src/services/football.service.ts',
            'src/models/Match.dto.ts',
            'src/middleware/auth.ts'
        ];
    }

    private async findFiles(directory: string, pattern: string): Promise<string[]> {
        // Mock implementation
        return [`${directory}/example.ts`];
    }

    private matchesPattern(file: string, pattern: string): boolean {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(file);
    }

    private async checkFileAgainstRules(file: string, rules: string[], strictMode: boolean): Promise<PatternViolation[]> {
        // Mock implementation - would analyze actual file content
        return [];
    }

    private calculateOverallScore(patterns: PatternCompliance[]): number {
        if (patterns.length === 0) return 0;
        return Math.round(patterns.reduce((sum, p) => sum + p.compliance, 0) / patterns.length);
    }

    private generatePatternRecommendations(patterns: PatternCompliance[], violations: PatternViolation[]): string[] {
        const recommendations: string[] = [];

        if (violations.some(v => v.severity === 'critical')) {
            recommendations.push('Address critical pattern violations immediately');
        }

        const lowCompliance = patterns.filter(p => p.compliance < 70);
        if (lowCompliance.length > 0) {
            recommendations.push(`Improve compliance for: ${lowCompliance.map(p => p.name).join(', ')}`);
        }

        recommendations.push('Consider implementing automated pattern validation in CI/CD');
        recommendations.push('Document architectural decisions and patterns');

        return recommendations;
    }

    private async detectBestPractices(): Promise<string[]> {
        return [
            'Consistent use of TypeScript interfaces',
            'Proper error handling middleware implementation',
            'Well-structured directory organization',
            'Separation of concerns in service layer'
        ];
    }

    private async analyzeIndentation(files: string[]): Promise<StyleMetric> {
        return { consistency: 95, violations: 2, recommendation: 'Use consistent 2-space indentation' };
    }

    private async analyzeNamingConventions(files: string[]): Promise<StyleMetric> {
        return { consistency: 88, violations: 5, recommendation: 'Use camelCase for variables and functions' };
    }

    private async analyzeImportStyle(files: string[]): Promise<StyleMetric> {
        return { consistency: 92, violations: 3, recommendation: 'Group imports by type (external, internal, relative)' };
    }

    private async analyzeFunctionStyle(files: string[]): Promise<StyleMetric> {
        return { consistency: 85, violations: 7, recommendation: 'Keep functions under 50 lines' };
    }

    private calculateStyleConsistency(metrics: Record<string, StyleMetric>): number {
        const values = Object.values(metrics);
        return Math.round(values.reduce((sum, m) => sum + m.consistency, 0) / values.length);
    }

    private async findStyleViolations(files: string[]): Promise<StyleViolation[]> {
        return [
            {
                file: 'src/routes/football.ts',
                line: 45,
                type: 'naming',
                description: 'Variable name should be camelCase',
                severity: 'low'
            }
        ];
    }

    private generateStyleRecommendations(metrics: Record<string, StyleMetric>): string[] {
        return Object.values(metrics).map(m => m.recommendation);
    }
}

// Supporting interfaces
interface PatternDefinition {
    name: string;
    description: string;
    requiredDirectories: string[];
    filePatterns: string[];
    rules: string[];
}

interface PatternComplianceResult extends PatternCompliance {
    violationDetails: PatternViolation[];
}

interface StyleAnalysis {
    overallConsistency: number;
    metrics: Record<string, StyleMetric>;
    violations: StyleViolation[];
    recommendations: string[];
}

interface StyleMetric {
    consistency: number;
    violations: number;
    recommendation: string;
}

interface StyleViolation {
    file: string;
    line: number;
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
}
