"use strict";
/**
 * Memory Store - Persistent memory system for codebase learning and evolution tracking
 *
 * Provides:
 * - Persistent storage of codebase analysis results
 * - Learning from code changes and patterns over time
 * - Historical tracking of technical debt and improvements
 * - Context-aware recommendations based on past analysis
 * - Performance metrics and trend analysis
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
exports.MemoryStore = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class MemoryStore {
    constructor(memoryDir) {
        this.entries = new Map();
        this.index = new Map(); // type -> entry IDs
        this.memoryDir = memoryDir;
        this.entriesFile = path.join(memoryDir, 'entries.json');
        this.indexFile = path.join(memoryDir, 'index.json');
        this.ensureDirectoryExists();
        this.loadMemory();
    }
    /**
     * Store a new memory entry
     */
    store(type_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (type, data, metadata = {}) {
            const id = this.generateId();
            const entry = {
                id,
                timestamp: new Date(),
                type: type,
                data,
                metadata: Object.assign({ version: '1.0.0', fileCount: 0, linesOfCode: 0 }, metadata)
            };
            this.entries.set(id, entry);
            this.updateIndex(type, id);
            yield this.persistMemory();
            console.error(`💾 Stored memory entry: ${type} (${id})`);
            return id;
        });
    }
    /**
     * Retrieve memory entries based on query
     */
    query() {
        return __awaiter(this, arguments, void 0, function* (query = {}) {
            let results = Array.from(this.entries.values());
            // Filter by type
            if (query.type) {
                results = results.filter(entry => entry.type === query.type);
            }
            // Filter by date
            if (query.since) {
                results = results.filter(entry => entry.timestamp >= query.since);
            }
            // Filter by tags (if stored in metadata)
            if (query.tags && query.tags.length > 0) {
                results = results.filter(entry => query.tags.some(tag => { var _a; return (_a = entry.metadata.tags) === null || _a === void 0 ? void 0 : _a.includes(tag); }));
            }
            // Sort by timestamp (newest first)
            results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            // Apply limit
            if (query.limit) {
                results = results.slice(0, query.limit);
            }
            return results;
        });
    }
    /**
     * Get memory statistics
     */
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const entries = Array.from(this.entries.values());
            const entriesByType = {};
            entries.forEach(entry => {
                entriesByType[entry.type] = (entriesByType[entry.type] || 0) + 1;
            });
            const timestamps = entries.map(e => e.timestamp);
            const oldestEntry = timestamps.length > 0 ? new Date(Math.min(...timestamps.map(t => t.getTime()))) : new Date();
            const newestEntry = timestamps.length > 0 ? new Date(Math.max(...timestamps.map(t => t.getTime()))) : new Date();
            const trendsDetected = yield this.detectTrends();
            return {
                totalEntries: entries.length,
                entriesByType,
                oldestEntry,
                newestEntry,
                averageAnalysisTime: this.calculateAverageAnalysisTime(entries),
                trendsDetected
            };
        });
    }
    /**
     * Analyze codebase evolution over time
     */
    analyzeEvolution() {
        return __awaiter(this, arguments, void 0, function* (timespan = '30d') {
            const since = this.parseTimespan(timespan);
            const entries = yield this.query({ since, type: 'analysis' });
            const changes = this.extractChanges(entries);
            const trends = this.analyzeTrends(entries);
            const recommendations = this.generateEvolutionRecommendations(changes, trends);
            return {
                timespan,
                changes,
                trends,
                recommendations
            };
        });
    }
    /**
     * Get contextual recommendations based on historical data
     */
    getContextualRecommendations(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const recommendations = [];
            // Analyze similar past situations
            const similarEntries = yield this.findSimilarContexts(context);
            if (similarEntries.length > 0) {
                recommendations.push('Based on similar past analysis, consider focusing on test coverage');
                recommendations.push('Historical data suggests prioritizing dependency updates');
            }
            // Check for recurring patterns
            const patterns = yield this.identifyRecurringPatterns();
            patterns.forEach(pattern => {
                recommendations.push(`Recurring pattern detected: ${pattern.description}`);
            });
            return recommendations;
        });
    }
    /**
     * Clear old memory entries to manage storage
     */
    cleanup(olderThan) {
        return __awaiter(this, void 0, void 0, function* () {
            const initialCount = this.entries.size;
            const entriesToRemove = [];
            this.entries.forEach((entry, id) => {
                if (entry.timestamp < olderThan) {
                    entriesToRemove.push(id);
                }
            });
            entriesToRemove.forEach(id => {
                const entry = this.entries.get(id);
                if (entry) {
                    this.entries.delete(id);
                    this.removeFromIndex(entry.type, id);
                }
            });
            yield this.persistMemory();
            const removedCount = initialCount - this.entries.size;
            console.error(`🧹 Cleaned up ${removedCount} old memory entries`);
            return removedCount;
        });
    }
    // Private helper methods
    ensureDirectoryExists() {
        if (!fs.existsSync(this.memoryDir)) {
            fs.mkdirSync(this.memoryDir, { recursive: true });
        }
    }
    loadMemory() {
        try {
            // Load entries
            if (fs.existsSync(this.entriesFile)) {
                const entriesData = fs.readFileSync(this.entriesFile, 'utf-8');
                const entriesArray = JSON.parse(entriesData);
                entriesArray.forEach((entry) => {
                    entry.timestamp = new Date(entry.timestamp);
                    this.entries.set(entry.id, entry);
                });
            }
            // Load index
            if (fs.existsSync(this.indexFile)) {
                const indexData = fs.readFileSync(this.indexFile, 'utf-8');
                const indexObj = JSON.parse(indexData);
                Object.entries(indexObj).forEach(([type, ids]) => {
                    this.index.set(type, ids);
                });
            }
            console.error(`💾 Loaded ${this.entries.size} memory entries`);
        }
        catch (error) {
            console.error('⚠️ Failed to load memory:', error);
        }
    }
    persistMemory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Save entries
                const entriesArray = Array.from(this.entries.values());
                fs.writeFileSync(this.entriesFile, JSON.stringify(entriesArray, null, 2));
                // Save index
                const indexObj = Object.fromEntries(this.index);
                fs.writeFileSync(this.indexFile, JSON.stringify(indexObj, null, 2));
            }
            catch (error) {
                console.error('⚠️ Failed to persist memory:', error);
            }
        });
    }
    generateId() {
        return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    updateIndex(type, id) {
        if (!this.index.has(type)) {
            this.index.set(type, []);
        }
        this.index.get(type).push(id);
    }
    removeFromIndex(type, id) {
        const ids = this.index.get(type);
        if (ids) {
            const index = ids.indexOf(id);
            if (index > -1) {
                ids.splice(index, 1);
            }
        }
    }
    parseTimespan(timespan) {
        const now = new Date();
        const match = timespan.match(/^(\d+)([dwmy])$/);
        if (!match) {
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default 30 days
        }
        const [, amount, unit] = match;
        const num = parseInt(amount);
        switch (unit) {
            case 'd': return new Date(now.getTime() - num * 24 * 60 * 60 * 1000);
            case 'w': return new Date(now.getTime() - num * 7 * 24 * 60 * 60 * 1000);
            case 'm': return new Date(now.getTime() - num * 30 * 24 * 60 * 60 * 1000);
            case 'y': return new Date(now.getTime() - num * 365 * 24 * 60 * 60 * 1000);
            default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
    }
    calculateAverageAnalysisTime(entries) {
        const analysisEntries = entries.filter(e => e.type === 'analysis');
        if (analysisEntries.length === 0)
            return 0;
        const totalTime = analysisEntries.reduce((sum, entry) => {
            return sum + (entry.metadata.analysisTime || 0);
        }, 0);
        return totalTime / analysisEntries.length;
    }
    detectTrends() {
        return __awaiter(this, void 0, void 0, function* () {
            const trends = [];
            const recentEntries = yield this.query({ since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) });
            if (recentEntries.length > 5) {
                trends.push('Increased analysis activity detected');
            }
            const debtEntries = recentEntries.filter(e => e.type === 'debt');
            if (debtEntries.length > 2) {
                trends.push('Technical debt tracking is active');
            }
            return trends;
        });
    }
    extractChanges(entries) {
        const changes = [];
        // Mock implementation - would analyze actual changes
        if (entries.length > 1) {
            changes.push({
                date: new Date(),
                type: 'improvement',
                description: 'Code complexity reduced in service layer',
                impact: 'medium',
                files: ['src/services/football.ts']
            });
        }
        return changes;
    }
    analyzeTrends(entries) {
        const trends = [];
        // Mock implementation - would analyze actual trends
        trends.push({
            metric: 'Test Coverage',
            direction: 'improving',
            confidence: 0.8,
            description: 'Test coverage has been steadily increasing'
        });
        return trends;
    }
    generateEvolutionRecommendations(changes, trends) {
        const recommendations = [];
        if (trends.some(t => t.metric === 'Test Coverage' && t.direction === 'improving')) {
            recommendations.push('Continue the positive trend in test coverage');
        }
        if (changes.some(c => c.type === 'improvement')) {
            recommendations.push('Build on recent code quality improvements');
        }
        return recommendations;
    }
    findSimilarContexts(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation - would use similarity matching
            return yield this.query({ limit: 5 });
        });
    }
    identifyRecurringPatterns() {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation - would identify actual patterns
            return [
                { description: 'Dependency updates often followed by test failures' },
                { description: 'Refactoring activities tend to cluster in service layer' }
            ];
        });
    }
}
exports.MemoryStore = MemoryStore;
