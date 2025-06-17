"use strict";
/**
 * Dependency Mapper - Comprehensive dependency analysis and optimization
 *
 * Provides:
 * - Dependency graph analysis and visualization
 * - Unused dependency detection
 * - Security vulnerability scanning
 * - Bundle size optimization suggestions
 * - Version conflict resolution
 * - Alternative package recommendations
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
exports.DependencyMapper = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DependencyMapper {
    constructor(projectRoot) {
        this.dependencyGraph = new Map();
        this.projectRoot = projectRoot;
        this.loadPackageFiles();
        this.buildDependencyGraph();
    }
    /**
     * Analyze dependencies based on specified criteria
     */
    analyzeDependencies(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(`📦 Analyzing dependencies: ${options.analysisType}`);
            const analysis = yield this.performAnalysis(options);
            const graph = Array.from(this.dependencyGraph.values());
            return {
                totalDependencies: graph.length,
                issuesFound: analysis.critical.length + analysis.warnings.length,
                potentialSavings: this.calculatePotentialSavings(analysis.optimizations),
                critical: analysis.critical,
                warnings: analysis.warnings,
                optimizations: analysis.optimizations,
                alternatives: options.suggestAlternatives ? analysis.alternatives : [],
                dependencyGraph: graph,
                recommendations: this.generateRecommendations(analysis, options)
            };
        });
    }
    /**
     * Find unused dependencies
     */
    findUnusedDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            console.error('🔍 Scanning for unused dependencies...');
            const declaredDeps = new Set([
                ...Object.keys(this.packageJson.dependencies || {}),
                ...Object.keys(this.packageJson.devDependencies || {})
            ]);
            const usedDeps = yield this.scanForUsedDependencies();
            const unused = Array.from(declaredDeps).filter(dep => !usedDeps.has(dep));
            return unused;
        });
    }
    /**
     * Check for security vulnerabilities
     */
    checkSecurityVulnerabilities() {
        return __awaiter(this, void 0, void 0, function* () {
            console.error('🔒 Checking for security vulnerabilities...');
            const vulnerabilities = [];
            // Mock implementation - in real scenario, would use npm audit or similar
            const knownVulnerabilities = [
                {
                    package: 'lodash',
                    version: '<4.17.21',
                    cve: 'CVE-2021-23337',
                    severity: 7.5,
                    description: 'Command injection vulnerability'
                }
            ];
            for (const vuln of knownVulnerabilities) {
                const node = this.dependencyGraph.get(vuln.package);
                if (node && this.isVersionVulnerable(node.version, vuln.version)) {
                    vulnerabilities.push({
                        package: vuln.package,
                        version: node.version,
                        description: vuln.description,
                        risk: this.severityToRisk(vuln.severity),
                        recommendedAction: `Update to latest version`,
                        cve: vuln.cve,
                        severity: vuln.severity
                    });
                }
            }
            return vulnerabilities;
        });
    }
    /**
     * Analyze bundle size impact
     */
    analyzeBundleSize() {
        return __awaiter(this, void 0, void 0, function* () {
            console.error('📊 Analyzing bundle size impact...');
            const optimizations = [];
            // Mock implementation - would analyze actual bundle sizes
            const largeDependencies = [
                { name: 'moment', size: '67.9kB', alternative: 'date-fns' },
                { name: 'lodash', size: '24.3kB', alternative: 'individual functions' }
            ];
            for (const dep of largeDependencies) {
                if (this.dependencyGraph.has(dep.name)) {
                    optimizations.push({
                        package: dep.name,
                        currentSize: dep.size,
                        suggestion: `Replace with ${dep.alternative}`,
                        benefit: `Reduce bundle size by ~${dep.size}`,
                        effort: 'medium'
                    });
                }
            }
            return optimizations;
        });
    }
    /**
     * Detect version conflicts
     */
    detectVersionConflicts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.error('⚠️ Detecting version conflicts...');
            const conflicts = [];
            const versionMap = new Map();
            // Build version map
            this.dependencyGraph.forEach((node, name) => {
                if (!versionMap.has(name)) {
                    versionMap.set(name, new Set());
                }
                versionMap.get(name).add(node.version);
            });
            // Find conflicts
            versionMap.forEach((versions, packageName) => {
                if (versions.size > 1) {
                    conflicts.push({
                        package: packageName,
                        version: Array.from(versions).join(', '),
                        description: `Multiple versions detected: ${Array.from(versions).join(', ')}`,
                        impact: 'May cause runtime issues or increased bundle size'
                    });
                }
            });
            return conflicts;
        });
    }
    /**
     * Get dependency usage statistics
     */
    getDependencyStats() {
        const nodes = Array.from(this.dependencyGraph.values());
        return {
            total: nodes.length,
            production: nodes.filter(n => n.type === 'production').length,
            development: nodes.filter(n => n.type === 'development').length,
            peer: nodes.filter(n => n.type === 'peer').length,
            withVulnerabilities: nodes.filter(n => n.vulnerabilities > 0).length,
            outdated: nodes.filter(n => this.isOutdated(n)).length,
            totalSize: this.calculateTotalSize(nodes)
        };
    }
    // Private helper methods
    loadPackageFiles() {
        try {
            const packagePath = path.join(this.projectRoot, 'package.json');
            this.packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
            const lockPath = path.join(this.projectRoot, 'package-lock.json');
            if (fs.existsSync(lockPath)) {
                this.packageLock = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
            }
        }
        catch (error) {
            console.error('Failed to load package files:', error);
            this.packageJson = {};
            this.packageLock = {};
        }
    }
    buildDependencyGraph() {
        const allDeps = Object.assign(Object.assign(Object.assign({}, this.packageJson.dependencies), this.packageJson.devDependencies), this.packageJson.peerDependencies);
        Object.entries(allDeps).forEach(([name, version]) => {
            const node = {
                name,
                version: version,
                type: this.getDependencyType(name),
                dependencies: this.getDependencies(name),
                dependents: this.getDependents(name),
                size: this.getPackageSize(name),
                lastUpdated: this.getLastUpdated(name),
                license: this.getLicense(name),
                vulnerabilities: this.getVulnerabilityCount(name)
            };
            this.dependencyGraph.set(name, node);
        });
    }
    performAnalysis(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const critical = [];
            const warnings = [];
            const optimizations = [];
            const alternatives = [];
            switch (options.analysisType) {
                case 'unused':
                    const unused = yield this.findUnusedDependencies();
                    unused.forEach(pkg => {
                        var _a, _b;
                        warnings.push({
                            package: pkg,
                            version: ((_a = this.packageJson.dependencies) === null || _a === void 0 ? void 0 : _a[pkg]) || ((_b = this.packageJson.devDependencies) === null || _b === void 0 ? void 0 : _b[pkg]) || 'unknown',
                            description: 'Package appears to be unused',
                            impact: 'Unnecessary bundle size and maintenance overhead'
                        });
                    });
                    break;
                case 'security':
                    const vulnerabilities = yield this.checkSecurityVulnerabilities();
                    critical.push(...vulnerabilities);
                    break;
                case 'bundle-size':
                    const sizeOptimizations = yield this.analyzeBundleSize();
                    optimizations.push(...sizeOptimizations);
                    break;
                case 'conflicts':
                    const conflicts = yield this.detectVersionConflicts();
                    warnings.push(...conflicts);
                    break;
                case 'outdated':
                    const outdated = this.findOutdatedDependencies();
                    outdated.forEach(pkg => {
                        warnings.push({
                            package: pkg.name,
                            version: pkg.current,
                            description: `Outdated version (latest: ${pkg.latest})`,
                            impact: 'Missing security fixes and features'
                        });
                    });
                    break;
            }
            if (options.suggestAlternatives) {
                alternatives.push(...this.suggestAlternatives());
            }
            return { critical, warnings, optimizations, alternatives };
        });
    }
    scanForUsedDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const used = new Set();
            // Mock implementation - would scan actual source files
            const commonDeps = ['express', 'cors', 'helmet', 'dotenv', 'axios'];
            commonDeps.forEach(dep => used.add(dep));
            return used;
        });
    }
    getDependencyType(name) {
        var _a, _b, _c;
        if ((_a = this.packageJson.dependencies) === null || _a === void 0 ? void 0 : _a[name])
            return 'production';
        if ((_b = this.packageJson.devDependencies) === null || _b === void 0 ? void 0 : _b[name])
            return 'development';
        if ((_c = this.packageJson.peerDependencies) === null || _c === void 0 ? void 0 : _c[name])
            return 'peer';
        return 'production';
    }
    getDependencies(name) {
        // Mock implementation - would extract from package-lock.json
        return [];
    }
    getDependents(name) {
        // Mock implementation - would find packages that depend on this one
        return [];
    }
    getPackageSize(name) {
        // Mock implementation - would get actual package size
        const sizes = {
            'express': '209kB',
            'axios': '13.3kB',
            'lodash': '24.3kB',
            'moment': '67.9kB'
        };
        return sizes[name] || '~5kB';
    }
    getLastUpdated(name) {
        // Mock implementation
        return '2024-01-15';
    }
    getLicense(name) {
        // Mock implementation
        return 'MIT';
    }
    getVulnerabilityCount(name) {
        // Mock implementation
        const vulnerable = ['lodash', 'moment'];
        return vulnerable.includes(name) ? 1 : 0;
    }
    isVersionVulnerable(current, vulnerable) {
        // Simplified version comparison
        return current.includes(vulnerable.replace('<', '').replace('>', ''));
    }
    severityToRisk(severity) {
        if (severity >= 9)
            return 'critical';
        if (severity >= 7)
            return 'high';
        if (severity >= 4)
            return 'medium';
        return 'low';
    }
    findOutdatedDependencies() {
        // Mock implementation
        return [
            { name: 'express', current: '4.18.0', latest: '4.18.2' }
        ];
    }
    suggestAlternatives() {
        return [
            {
                current: 'moment',
                suggested: 'date-fns',
                reason: 'Smaller bundle size and better tree-shaking',
                benefits: ['Reduced bundle size', 'Better performance', 'Modular imports'],
                migrationEffort: 'medium'
            },
            {
                current: 'lodash',
                suggested: 'individual lodash functions',
                reason: 'Import only needed functions to reduce bundle size',
                benefits: ['Smaller bundle size', 'Better tree-shaking'],
                migrationEffort: 'low'
            }
        ];
    }
    isOutdated(node) {
        // Mock implementation
        return Math.random() > 0.8;
    }
    calculateTotalSize(nodes) {
        // Mock implementation
        return '2.3MB';
    }
    calculatePotentialSavings(optimizations) {
        if (optimizations.length === 0)
            return '0kB';
        return `~${optimizations.length * 20}kB`;
    }
    generateRecommendations(analysis, options) {
        const recommendations = [];
        if (analysis.critical.length > 0) {
            recommendations.push('Address critical security vulnerabilities immediately');
        }
        if (analysis.warnings.length > 5) {
            recommendations.push('Consider regular dependency maintenance schedule');
        }
        if (analysis.optimizations.length > 0) {
            recommendations.push('Implement bundle size optimizations for better performance');
        }
        recommendations.push('Set up automated dependency scanning in CI/CD pipeline');
        recommendations.push('Consider using dependency update tools like Renovate or Dependabot');
        return recommendations;
    }
}
exports.DependencyMapper = DependencyMapper;
