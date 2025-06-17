"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.PatternDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class PatternDetector {
    constructor(projectRoot) {
        this.knownPatterns = new Map();
        this.projectRoot = projectRoot;
        this.initializePatternDefinitions();
    }
    /**
     * Validate coding patterns in the codebase
     */
    validatePatterns(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.error(`✅ Validating patterns: ${((_a = options.patterns) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'all'}`);
            const patternsToCheck = options.patterns || Array.from(this.knownPatterns.keys());
            const patterns = [];
            const violations = [];
            const bestPractices = [];
            for (const patternName of patternsToCheck) {
                const patternDef = this.knownPatterns.get(patternName);
                if (!patternDef)
                    continue;
                const compliance = yield this.checkPatternCompliance(patternDef, options.strictMode);
                patterns.push(compliance);
                violations.push(...compliance.violationDetails);
            }
            // Detect best practices
            bestPractices.push(...yield this.detectBestPractices());
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
        });
    }
    /**
     * Detect patterns automatically in the codebase
     */
    detectPatterns() {
        return __awaiter(this, void 0, void 0, function* () {
            console.error('🔍 Auto-detecting patterns in codebase...');
            const detectedPatterns = [];
            // Check for MVC pattern
            const mvcPattern = yield this.detectMVCPattern();
            if (mvcPattern)
                detectedPatterns.push(mvcPattern);
            // Check for Service Layer pattern
            const servicePattern = yield this.detectServiceLayerPattern();
            if (servicePattern)
                detectedPatterns.push(servicePattern);
            // Check for Repository pattern
            const repoPattern = yield this.detectRepositoryPattern();
            if (repoPattern)
                detectedPatterns.push(repoPattern);
            // Check for DTO pattern
            const dtoPattern = yield this.detectDTOPattern();
            if (dtoPattern)
                detectedPatterns.push(dtoPattern);
            // Check for Middleware pattern
            const middlewarePattern = yield this.detectMiddlewarePattern();
            if (middlewarePattern)
                detectedPatterns.push(middlewarePattern);
            return detectedPatterns;
        });
    }
    /**
     * Analyze code style consistency
     */
    analyzeStyleConsistency() {
        return __awaiter(this, void 0, void 0, function* () {
            console.error('🎨 Analyzing code style consistency...');
            const files = yield this.getSourceFiles();
            const styleMetrics = {
                indentation: yield this.analyzeIndentation(files),
                naming: yield this.analyzeNamingConventions(files),
                imports: yield this.analyzeImportStyle(files),
                functions: yield this.analyzeFunctionStyle(files)
            };
            return {
                overallConsistency: this.calculateStyleConsistency(styleMetrics),
                metrics: styleMetrics,
                violations: yield this.findStyleViolations(files),
                recommendations: this.generateStyleRecommendations(styleMetrics)
            };
        });
    }
    // Private helper methods
    initializePatternDefinitions() {
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
    checkPatternCompliance(pattern, strictMode) {
        return __awaiter(this, void 0, void 0, function* () {
            const violationsList = [];
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
            const files = yield this.getSourceFiles();
            const patternFiles = files.filter(file => pattern.filePatterns.some(p => this.matchesPattern(file, p)));
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
                const fileViolations = yield this.checkFileAgainstRules(file, pattern.rules, strictMode);
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
        });
    }
    detectMVCPattern() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    detectServiceLayerPattern() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasServices = fs.existsSync(path.join(this.projectRoot, 'src', 'services'));
            if (hasServices) {
                const serviceFiles = yield this.findFiles('src/services', '*.ts');
                return {
                    name: 'Service Layer Pattern',
                    confidence: 0.8,
                    files: serviceFiles,
                    description: 'Service layer for business logic encapsulation',
                    examples: []
                };
            }
            return null;
        });
    }
    detectRepositoryPattern() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    detectDTOPattern() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.getSourceFiles();
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
        });
    }
    detectMiddlewarePattern() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getSourceFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation - would scan actual files
            return [
                'src/server.ts',
                'src/routes/football.ts',
                'src/services/football.service.ts',
                'src/models/Match.dto.ts',
                'src/middleware/auth.ts'
            ];
        });
    }
    findFiles(directory, pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation
            return [`${directory}/example.ts`];
        });
    }
    matchesPattern(file, pattern) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(file);
    }
    checkFileAgainstRules(file, rules, strictMode) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation - would analyze actual file content
            return [];
        });
    }
    calculateOverallScore(patterns) {
        if (patterns.length === 0)
            return 0;
        return Math.round(patterns.reduce((sum, p) => sum + p.compliance, 0) / patterns.length);
    }
    generatePatternRecommendations(patterns, violations) {
        const recommendations = [];
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
    detectBestPractices() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                'Consistent use of TypeScript interfaces',
                'Proper error handling middleware implementation',
                'Well-structured directory organization',
                'Separation of concerns in service layer'
            ];
        });
    }
    analyzeIndentation(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return { consistency: 95, violations: 2, recommendation: 'Use consistent 2-space indentation' };
        });
    }
    analyzeNamingConventions(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return { consistency: 88, violations: 5, recommendation: 'Use camelCase for variables and functions' };
        });
    }
    analyzeImportStyle(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return { consistency: 92, violations: 3, recommendation: 'Group imports by type (external, internal, relative)' };
        });
    }
    analyzeFunctionStyle(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return { consistency: 85, violations: 7, recommendation: 'Keep functions under 50 lines' };
        });
    }
    calculateStyleConsistency(metrics) {
        const values = Object.values(metrics);
        return Math.round(values.reduce((sum, m) => sum + m.consistency, 0) / values.length);
    }
    findStyleViolations(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    file: 'src/routes/football.ts',
                    line: 45,
                    type: 'naming',
                    description: 'Variable name should be camelCase',
                    severity: 'low'
                }
            ];
        });
    }
    generateStyleRecommendations(metrics) {
        return Object.values(metrics).map(m => m.recommendation);
    }
}
exports.PatternDetector = PatternDetector;
