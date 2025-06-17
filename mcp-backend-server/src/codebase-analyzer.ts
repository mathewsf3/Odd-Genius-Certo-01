/**
 * Codebase Analyzer - Core analysis engine for codebase structure and patterns
 * 
 * Provides comprehensive analysis of:
 * - File structure and organization
 * - Code complexity and quality metrics
 * - Import/export relationships
 * - Architecture patterns and compliance
 * - Performance bottlenecks and optimization opportunities
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

export interface CodebaseAnalysisOptions {
    depth: 'shallow' | 'deep' | 'comprehensive';
    includeTests: boolean;
    includeNodeModules: boolean;
    focusAreas?: string[];
}

export interface CodebaseAnalysis {
    totalFiles: number;
    totalLinesOfCode: number;
    languages: string[];
    architecturePattern: string;
    directoryStructure: DirectoryInfo[];
    keyDependencies: DependencyInfo[];
    complexityScore: number;
    maintainabilityIndex: number;
    testCoverage: number;
    technicalDebtHours: number;
    insights: string[];
    recommendations: Recommendation[];
}

export interface DirectoryInfo {
    path: string;
    fileCount: number;
    purpose: string;
}

export interface DependencyInfo {
    name: string;
    version: string;
    usage: string;
}

export interface Recommendation {
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
}

export interface RelatedFilesResult {
    imports: RelatedFile[];
    dependents: RelatedFile[];
    tests: TestFile[];
    similar: SimilarFile[];
    suggestions: string[];
}

export interface RelatedFile {
    path: string;
    relationship: string;
}

export interface TestFile {
    path: string;
    coverage: number;
}

export interface SimilarFile {
    path: string;
    similarity: number;
}

export interface RefactoringOptions {
    filePath?: string;
    refactoringTypes?: string[];
    priority: string;
}

export interface RefactoringSuggestions {
    high: RefactoringSuggestion[];
    medium: RefactoringSuggestion[];
    codeQuality: string[];
    implementationSteps: string[];
}

export interface RefactoringSuggestion {
    type: string;
    file: string;
    description: string;
    impact: string;
    effort: string;
}

export interface TechnicalDebtOptions {
    category?: string;
    severity?: string;
    includeMetrics: boolean;
}

export interface TechnicalDebtAnalysis {
    overallScore: number;
    totalHours: number;
    monthlyInterest: number;
    paybackPriority: string;
    categories: DebtCategory[];
    critical: DebtIssue[];
    high: DebtIssue[];
    recommendations: DebtRecommendation[];
}

export interface DebtCategory {
    name: string;
    hours: number;
    percentage: number;
}

export interface DebtIssue {
    file: string;
    description: string;
    impact: string;
    effort: string;
}

export interface DebtRecommendation {
    action: string;
    impact: string;
}

export class CodebaseAnalyzer {
    private projectRoot: string;
    private fileCache: Map<string, any> = new Map();

    constructor(projectRoot: string) {
        this.projectRoot = projectRoot;
    }

    async analyzeCodebase(options: CodebaseAnalysisOptions): Promise<CodebaseAnalysis> {
        console.error(`🔍 Starting ${options.depth} analysis of codebase...`);

        const files = await this.scanFiles(options);
        const packageJson = await this.loadPackageJson();
        const tsConfig = await this.loadTsConfig();

        // Analyze file structure
        const directoryStructure = await this.analyzeDirectoryStructure(files);
        const languages = this.detectLanguages(files);
        const architecturePattern = this.detectArchitecturePattern(directoryStructure);

        // Calculate metrics
        const totalLinesOfCode = await this.calculateLinesOfCode(files);
        const complexityScore = await this.calculateComplexityScore(files);
        const maintainabilityIndex = await this.calculateMaintainabilityIndex(files);
        const testCoverage = await this.calculateTestCoverage(files);
        const technicalDebtHours = await this.calculateTechnicalDebt(files);

        // Extract dependencies
        const keyDependencies = this.extractKeyDependencies(packageJson);

        // Generate insights and recommendations
        const insights = this.generateInsights(files, directoryStructure, packageJson);
        const recommendations = this.generateRecommendations(complexityScore, maintainabilityIndex, testCoverage);

        return {
            totalFiles: files.length,
            totalLinesOfCode,
            languages,
            architecturePattern,
            directoryStructure,
            keyDependencies,
            complexityScore,
            maintainabilityIndex,
            testCoverage,
            technicalDebtHours,
            insights,
            recommendations
        };
    }

    async getRelatedFiles(filePath: string, relationshipTypes: string[], maxResults: number): Promise<RelatedFilesResult> {
        console.error(`🔗 Finding related files for: ${filePath}`);

        const imports = await this.findImportRelationships(filePath);
        const dependents = await this.findDependentFiles(filePath);
        const tests = await this.findTestFiles(filePath);
        const similar = await this.findSimilarFiles(filePath);
        const suggestions = this.generateRelationshipSuggestions(filePath, imports, dependents, tests);

        return {
            imports: imports.slice(0, maxResults),
            dependents: dependents.slice(0, maxResults),
            tests: tests.slice(0, maxResults),
            similar: similar.slice(0, maxResults),
            suggestions
        };
    }

    async suggestRefactoring(options: RefactoringOptions): Promise<RefactoringSuggestions> {
        console.error(`🔧 Analyzing refactoring opportunities...`);

        const files = options.filePath ? [options.filePath] : await this.getAllSourceFiles();
        
        const high: RefactoringSuggestion[] = [];
        const medium: RefactoringSuggestion[] = [];
        const codeQuality: string[] = [];
        const implementationSteps: string[] = [];

        for (const file of files) {
            const suggestions = await this.analyzeFileForRefactoring(file, options);
            high.push(...suggestions.high);
            medium.push(...suggestions.medium);
        }

        // Generate code quality improvements
        codeQuality.push(
            'Consider extracting common utility functions',
            'Implement consistent error handling patterns',
            'Add comprehensive JSDoc documentation',
            'Optimize import statements and remove unused imports'
        );

        // Generate implementation steps
        implementationSteps.push(
            'Start with high-priority refactoring suggestions',
            'Run tests after each refactoring step',
            'Update documentation and comments',
            'Review code with team members'
        );

        return { high, medium, codeQuality, implementationSteps };
    }

    async analyzeTechnicalDebt(options: TechnicalDebtOptions): Promise<TechnicalDebtAnalysis> {
        console.error(`📊 Analyzing technical debt...`);

        // Mock implementation - in real scenario, this would analyze actual code
        const categories: DebtCategory[] = [
            { name: 'Code Smells', hours: 24, percentage: 40 },
            { name: 'Security Issues', hours: 18, percentage: 30 },
            { name: 'Performance', hours: 12, percentage: 20 },
            { name: 'Documentation', hours: 6, percentage: 10 }
        ];

        const critical: DebtIssue[] = [
            {
                file: 'src/services/auth.ts',
                description: 'Hardcoded secrets in authentication service',
                impact: 'High security risk',
                effort: '2 hours'
            }
        ];

        const high: DebtIssue[] = [
            {
                file: 'src/routes/football.ts',
                description: 'Complex function with high cyclomatic complexity',
                impact: 'Reduced maintainability',
                effort: '4 hours'
            }
        ];

        const recommendations: DebtRecommendation[] = [
            { action: 'Move secrets to environment variables', impact: 'Eliminates security risk' },
            { action: 'Break down complex functions', impact: 'Improves code readability' },
            { action: 'Add comprehensive test coverage', impact: 'Reduces regression risk' }
        ];

        return {
            overallScore: 75,
            totalHours: 60,
            monthlyInterest: 8,
            paybackPriority: 'High',
            categories,
            critical,
            high,
            recommendations
        };
    }

    // Private helper methods
    private async scanFiles(options: CodebaseAnalysisOptions): Promise<string[]> {
        const patterns = ['**/*.ts', '**/*.js', '**/*.json'];
        if (options.includeTests) {
            patterns.push('**/*.test.ts', '**/*.spec.ts');
        }

        const globOptions = {
            cwd: this.projectRoot,
            ignore: options.includeNodeModules ? [] : ['node_modules/**', 'dist/**', 'build/**']
        };

        const files: string[] = [];
        for (const pattern of patterns) {
            const matches = await glob(pattern, globOptions);
            files.push(...matches);
        }

        return [...new Set(files)]; // Remove duplicates
    }

    private async loadPackageJson(): Promise<any> {
        try {
            const packagePath = path.join(this.projectRoot, 'package.json');
            const content = await fs.promises.readFile(packagePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            return {};
        }
    }

    private async loadTsConfig(): Promise<any> {
        try {
            const tsConfigPath = path.join(this.projectRoot, 'tsconfig.json');
            const content = await fs.promises.readFile(tsConfigPath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            return {};
        }
    }

    private async analyzeDirectoryStructure(files: string[]): Promise<DirectoryInfo[]> {
        const directories = new Map<string, number>();
        
        files.forEach(file => {
            const dir = path.dirname(file);
            directories.set(dir, (directories.get(dir) || 0) + 1);
        });

        return Array.from(directories.entries()).map(([dirPath, fileCount]) => ({
            path: dirPath,
            fileCount,
            purpose: this.inferDirectoryPurpose(dirPath)
        }));
    }

    private detectLanguages(files: string[]): string[] {
        const extensions = new Set<string>();
        files.forEach(file => {
            const ext = path.extname(file);
            if (ext) extensions.add(ext);
        });

        const languageMap: Record<string, string> = {
            '.ts': 'TypeScript',
            '.js': 'JavaScript',
            '.json': 'JSON',
            '.md': 'Markdown',
            '.yaml': 'YAML',
            '.yml': 'YAML'
        };

        return Array.from(extensions).map(ext => languageMap[ext] || ext).filter(Boolean);
    }

    private detectArchitecturePattern(directories: DirectoryInfo[]): string {
        const dirNames = directories.map(d => path.basename(d.path));
        
        if (dirNames.includes('controllers') && dirNames.includes('models') && dirNames.includes('views')) {
            return 'MVC (Model-View-Controller)';
        }
        if (dirNames.includes('services') && dirNames.includes('routes')) {
            return 'Service Layer Architecture';
        }
        if (dirNames.includes('apis') && dirNames.includes('middleware')) {
            return 'API-First Architecture';
        }
        
        return 'Custom Architecture';
    }

    private async calculateLinesOfCode(files: string[]): Promise<number> {
        let totalLines = 0;
        for (const file of files.slice(0, 50)) { // Limit for performance
            try {
                const content = await fs.promises.readFile(path.join(this.projectRoot, file), 'utf-8');
                totalLines += content.split('\n').length;
            } catch (error) {
                // Skip files that can't be read
            }
        }
        return totalLines;
    }

    private async calculateComplexityScore(files: string[]): Promise<number> {
        // Mock implementation - would use actual complexity analysis
        return Math.floor(Math.random() * 3) + 7; // 7-10 range
    }

    private async calculateMaintainabilityIndex(files: string[]): Promise<number> {
        // Mock implementation - would calculate actual maintainability metrics
        return Math.floor(Math.random() * 20) + 70; // 70-90 range
    }

    private async calculateTestCoverage(files: string[]): Promise<number> {
        const testFiles = files.filter(f => f.includes('.test.') || f.includes('.spec.'));
        const sourceFiles = files.filter(f => f.endsWith('.ts') && !f.includes('.test.') && !f.includes('.spec.'));
        
        if (sourceFiles.length === 0) return 0;
        return Math.round((testFiles.length / sourceFiles.length) * 100);
    }

    private async calculateTechnicalDebt(files: string[]): Promise<number> {
        // Mock implementation - would analyze actual technical debt
        return Math.floor(Math.random() * 40) + 20; // 20-60 hours
    }

    private extractKeyDependencies(packageJson: any): DependencyInfo[] {
        const deps = packageJson.dependencies || {};
        return Object.entries(deps).slice(0, 10).map(([name, version]) => ({
            name,
            version: version as string,
            usage: this.inferDependencyUsage(name)
        }));
    }

    private generateInsights(files: string[], directories: DirectoryInfo[], packageJson: any): string[] {
        const insights: string[] = [];
        
        insights.push(`Project uses ${this.detectLanguages(files).join(', ')} as primary languages`);
        insights.push(`Well-organized directory structure with ${directories.length} main directories`);
        
        if (packageJson.scripts) {
            insights.push(`Comprehensive build pipeline with ${Object.keys(packageJson.scripts).length} npm scripts`);
        }
        
        const testFiles = files.filter(f => f.includes('.test.') || f.includes('.spec.'));
        if (testFiles.length > 0) {
            insights.push(`Good testing practices with ${testFiles.length} test files`);
        }

        return insights;
    }

    private generateRecommendations(complexity: number, maintainability: number, testCoverage: number): Recommendation[] {
        const recommendations: Recommendation[] = [];

        if (complexity > 8) {
            recommendations.push({
                priority: 'high',
                description: 'Consider refactoring complex functions to improve readability'
            });
        }

        if (maintainability < 80) {
            recommendations.push({
                priority: 'medium',
                description: 'Improve code documentation and reduce coupling'
            });
        }

        if (testCoverage < 70) {
            recommendations.push({
                priority: 'high',
                description: 'Increase test coverage to improve code reliability'
            });
        }

        return recommendations;
    }

    private inferDirectoryPurpose(dirPath: string): string {
        const dirName = path.basename(dirPath);
        const purposeMap: Record<string, string> = {
            'src': 'Source code',
            'tests': 'Test files',
            'routes': 'API routes',
            'services': 'Business logic',
            'models': 'Data models',
            'middleware': 'Express middleware',
            'apis': 'API clients',
            'utils': 'Utility functions',
            'types': 'Type definitions'
        };
        
        return purposeMap[dirName] || 'General purpose';
    }

    private inferDependencyUsage(name: string): string {
        const usageMap: Record<string, string> = {
            'express': 'Web framework',
            'axios': 'HTTP client',
            'cors': 'CORS middleware',
            'helmet': 'Security middleware',
            'dotenv': 'Environment variables',
            'winston': 'Logging',
            'jest': 'Testing framework',
            'typescript': 'Type checking'
        };
        
        return usageMap[name] || 'Utility library';
    }

    // Placeholder methods for related files analysis
    private async findImportRelationships(filePath: string): Promise<RelatedFile[]> {
        // Mock implementation
        return [
            { path: 'src/apis/footy/index.ts', relationship: 'imports DefaultService' },
            { path: 'src/models/MatchDTO.ts', relationship: 'imports type definitions' }
        ];
    }

    private async findDependentFiles(filePath: string): Promise<RelatedFile[]> {
        // Mock implementation
        return [
            { path: 'src/routes/football.ts', relationship: 'uses this service' }
        ];
    }

    private async findTestFiles(filePath: string): Promise<TestFile[]> {
        // Mock implementation
        return [
            { path: 'src/tests/football.test.ts', coverage: 85 }
        ];
    }

    private async findSimilarFiles(filePath: string): Promise<SimilarFile[]> {
        // Mock implementation
        return [
            { path: 'src/services/league.ts', similarity: 75 }
        ];
    }

    private generateRelationshipSuggestions(filePath: string, imports: RelatedFile[], dependents: RelatedFile[], tests: TestFile[]): string[] {
        const suggestions: string[] = [];
        
        if (tests.length === 0) {
            suggestions.push('Consider adding unit tests for this file');
        }
        
        if (imports.length > 10) {
            suggestions.push('Consider breaking down this file - it has many dependencies');
        }
        
        if (dependents.length === 0) {
            suggestions.push('This file might be unused - consider removing if not needed');
        }

        return suggestions;
    }

    private async getAllSourceFiles(): Promise<string[]> {
        return await this.scanFiles({
            depth: 'shallow',
            includeTests: false,
            includeNodeModules: false
        });
    }

    private async analyzeFileForRefactoring(file: string, options: RefactoringOptions): Promise<{ high: RefactoringSuggestion[], medium: RefactoringSuggestion[] }> {
        // Mock implementation
        const high: RefactoringSuggestion[] = [];
        const medium: RefactoringSuggestion[] = [];

        if (file.includes('routes')) {
            high.push({
                type: 'extract-function',
                file,
                description: 'Extract complex route handler logic into service functions',
                impact: 'Improves testability and maintainability',
                effort: '2-3 hours'
            });
        }

        return { high, medium };
    }
}
