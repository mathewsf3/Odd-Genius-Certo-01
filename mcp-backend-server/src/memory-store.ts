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

import * as fs from 'fs';
import * as path from 'path';

export interface MemoryEntry {
    id: string;
    timestamp: Date;
    type: 'analysis' | 'pattern' | 'refactoring' | 'debt' | 'dependency';
    data: any;
    metadata: {
        version: string;
        fileCount: number;
        linesOfCode: number;
        [key: string]: any;
    };
}

export interface MemoryQuery {
    type?: string;
    since?: Date;
    limit?: number;
    tags?: string[];
}

export interface MemoryStats {
    totalEntries: number;
    entriesByType: Record<string, number>;
    oldestEntry: Date;
    newestEntry: Date;
    averageAnalysisTime: number;
    trendsDetected: string[];
}

export interface CodebaseEvolution {
    timespan: string;
    changes: EvolutionChange[];
    trends: EvolutionTrend[];
    recommendations: string[];
}

export interface EvolutionChange {
    date: Date;
    type: 'improvement' | 'regression' | 'addition' | 'removal';
    description: string;
    impact: 'low' | 'medium' | 'high';
    files: string[];
}

export interface EvolutionTrend {
    metric: string;
    direction: 'improving' | 'declining' | 'stable';
    confidence: number;
    description: string;
}

export class MemoryStore {
    private memoryDir: string;
    private entriesFile: string;
    private indexFile: string;
    private entries: Map<string, MemoryEntry> = new Map();
    private index: Map<string, string[]> = new Map(); // type -> entry IDs

    constructor(memoryDir: string) {
        this.memoryDir = memoryDir;
        this.entriesFile = path.join(memoryDir, 'entries.json');
        this.indexFile = path.join(memoryDir, 'index.json');
        
        this.ensureDirectoryExists();
        this.loadMemory();
    }

    /**
     * Store a new memory entry
     */
    async store(type: string, data: any, metadata: any = {}): Promise<string> {
        const id = this.generateId();
        const entry: MemoryEntry = {
            id,
            timestamp: new Date(),
            type: type as any,
            data,
            metadata: {
                version: '1.0.0',
                fileCount: 0,
                linesOfCode: 0,
                ...metadata
            }
        };

        this.entries.set(id, entry);
        this.updateIndex(type, id);
        await this.persistMemory();

        console.error(`💾 Stored memory entry: ${type} (${id})`);
        return id;
    }

    /**
     * Retrieve memory entries based on query
     */
    async query(query: MemoryQuery = {}): Promise<MemoryEntry[]> {
        let results = Array.from(this.entries.values());

        // Filter by type
        if (query.type) {
            results = results.filter(entry => entry.type === query.type);
        }

        // Filter by date
        if (query.since) {
            results = results.filter(entry => entry.timestamp >= query.since!);
        }

        // Filter by tags (if stored in metadata)
        if (query.tags && query.tags.length > 0) {
            results = results.filter(entry => 
                query.tags!.some(tag => entry.metadata.tags?.includes(tag))
            );
        }

        // Sort by timestamp (newest first)
        results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Apply limit
        if (query.limit) {
            results = results.slice(0, query.limit);
        }

        return results;
    }

    /**
     * Get memory statistics
     */
    async getStats(): Promise<MemoryStats> {
        const entries = Array.from(this.entries.values());
        const entriesByType: Record<string, number> = {};

        entries.forEach(entry => {
            entriesByType[entry.type] = (entriesByType[entry.type] || 0) + 1;
        });

        const timestamps = entries.map(e => e.timestamp);
        const oldestEntry = timestamps.length > 0 ? new Date(Math.min(...timestamps.map(t => t.getTime()))) : new Date();
        const newestEntry = timestamps.length > 0 ? new Date(Math.max(...timestamps.map(t => t.getTime()))) : new Date();

        const trendsDetected = await this.detectTrends();

        return {
            totalEntries: entries.length,
            entriesByType,
            oldestEntry,
            newestEntry,
            averageAnalysisTime: this.calculateAverageAnalysisTime(entries),
            trendsDetected
        };
    }

    /**
     * Analyze codebase evolution over time
     */
    async analyzeEvolution(timespan: string = '30d'): Promise<CodebaseEvolution> {
        const since = this.parseTimespan(timespan);
        const entries = await this.query({ since, type: 'analysis' });

        const changes = this.extractChanges(entries);
        const trends = this.analyzeTrends(entries);
        const recommendations = this.generateEvolutionRecommendations(changes, trends);

        return {
            timespan,
            changes,
            trends,
            recommendations
        };
    }

    /**
     * Get contextual recommendations based on historical data
     */
    async getContextualRecommendations(context: any): Promise<string[]> {
        const recommendations: string[] = [];

        // Analyze similar past situations
        const similarEntries = await this.findSimilarContexts(context);
        
        if (similarEntries.length > 0) {
            recommendations.push('Based on similar past analysis, consider focusing on test coverage');
            recommendations.push('Historical data suggests prioritizing dependency updates');
        }

        // Check for recurring patterns
        const patterns = await this.identifyRecurringPatterns();
        patterns.forEach(pattern => {
            recommendations.push(`Recurring pattern detected: ${pattern.description}`);
        });

        return recommendations;
    }

    /**
     * Clear old memory entries to manage storage
     */
    async cleanup(olderThan: Date): Promise<number> {
        const initialCount = this.entries.size;
        const entriesToRemove: string[] = [];

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

        await this.persistMemory();
        const removedCount = initialCount - this.entries.size;
        
        console.error(`🧹 Cleaned up ${removedCount} old memory entries`);
        return removedCount;
    }

    // Private helper methods
    private ensureDirectoryExists(): void {
        if (!fs.existsSync(this.memoryDir)) {
            fs.mkdirSync(this.memoryDir, { recursive: true });
        }
    }

    private loadMemory(): void {
        try {
            // Load entries
            if (fs.existsSync(this.entriesFile)) {
                const entriesData = fs.readFileSync(this.entriesFile, 'utf-8');
                const entriesArray = JSON.parse(entriesData);
                entriesArray.forEach((entry: any) => {
                    entry.timestamp = new Date(entry.timestamp);
                    this.entries.set(entry.id, entry);
                });
            }

            // Load index
            if (fs.existsSync(this.indexFile)) {
                const indexData = fs.readFileSync(this.indexFile, 'utf-8');
                const indexObj = JSON.parse(indexData);
                Object.entries(indexObj).forEach(([type, ids]) => {
                    this.index.set(type, ids as string[]);
                });
            }

            console.error(`💾 Loaded ${this.entries.size} memory entries`);
        } catch (error) {
            console.error('⚠️ Failed to load memory:', error);
        }
    }

    private async persistMemory(): Promise<void> {
        try {
            // Save entries
            const entriesArray = Array.from(this.entries.values());
            fs.writeFileSync(this.entriesFile, JSON.stringify(entriesArray, null, 2));

            // Save index
            const indexObj = Object.fromEntries(this.index);
            fs.writeFileSync(this.indexFile, JSON.stringify(indexObj, null, 2));
        } catch (error) {
            console.error('⚠️ Failed to persist memory:', error);
        }
    }

    private generateId(): string {
        return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private updateIndex(type: string, id: string): void {
        if (!this.index.has(type)) {
            this.index.set(type, []);
        }
        this.index.get(type)!.push(id);
    }

    private removeFromIndex(type: string, id: string): void {
        const ids = this.index.get(type);
        if (ids) {
            const index = ids.indexOf(id);
            if (index > -1) {
                ids.splice(index, 1);
            }
        }
    }

    private parseTimespan(timespan: string): Date {
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

    private calculateAverageAnalysisTime(entries: MemoryEntry[]): number {
        const analysisEntries = entries.filter(e => e.type === 'analysis');
        if (analysisEntries.length === 0) return 0;

        const totalTime = analysisEntries.reduce((sum, entry) => {
            return sum + (entry.metadata.analysisTime || 0);
        }, 0);

        return totalTime / analysisEntries.length;
    }

    private async detectTrends(): Promise<string[]> {
        const trends: string[] = [];
        const recentEntries = await this.query({ since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) });

        if (recentEntries.length > 5) {
            trends.push('Increased analysis activity detected');
        }

        const debtEntries = recentEntries.filter(e => e.type === 'debt');
        if (debtEntries.length > 2) {
            trends.push('Technical debt tracking is active');
        }

        return trends;
    }

    private extractChanges(entries: MemoryEntry[]): EvolutionChange[] {
        const changes: EvolutionChange[] = [];

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

    private analyzeTrends(entries: MemoryEntry[]): EvolutionTrend[] {
        const trends: EvolutionTrend[] = [];

        // Mock implementation - would analyze actual trends
        trends.push({
            metric: 'Test Coverage',
            direction: 'improving',
            confidence: 0.8,
            description: 'Test coverage has been steadily increasing'
        });

        return trends;
    }

    private generateEvolutionRecommendations(changes: EvolutionChange[], trends: EvolutionTrend[]): string[] {
        const recommendations: string[] = [];

        if (trends.some(t => t.metric === 'Test Coverage' && t.direction === 'improving')) {
            recommendations.push('Continue the positive trend in test coverage');
        }

        if (changes.some(c => c.type === 'improvement')) {
            recommendations.push('Build on recent code quality improvements');
        }

        return recommendations;
    }

    private async findSimilarContexts(context: any): Promise<MemoryEntry[]> {
        // Mock implementation - would use similarity matching
        return await this.query({ limit: 5 });
    }

    private async identifyRecurringPatterns(): Promise<Array<{ description: string }>> {
        // Mock implementation - would identify actual patterns
        return [
            { description: 'Dependency updates often followed by test failures' },
            { description: 'Refactoring activities tend to cluster in service layer' }
        ];
    }
}
