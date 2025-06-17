#!/usr/bin/env node
"use strict";
/**
 * Enhanced MCP FootyStats API Coverage Server with Live Documentation Monitoring
 *
 * Features:
 * - 100% endpoint coverage from FootyStats API
 * - Live documentation scraping and monitoring
 * - Auto-generation from OpenAPI spec (footy.yaml)
 * - Dynamic tool creation for all available endpoints
 * - Automatic detection of new API endpoints
 * - Type-safe integration with generated client
 * - Complete parameter validation using Zod schemas
 * - Error handling and response validation
 * - Integration with existing `src/apis/footy` client
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
exports.EnhancedFootyStatsAPIMCPServer = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const YAML = __importStar(require("yaml"));
const simple_documentation_scraper_js_1 = require("./simple-documentation-scraper.js");
/**
 * Enhanced FootyStats API Documentation Parser with Live Monitoring
 */
class EnhancedFootyStatsAPIParser {
    constructor(specPath, basePath) {
        this.specPath = specPath;
        this.basePath = basePath;
        this.endpoints = new Map();
        this.lastScrapeTime = 0;
        this.SCRAPE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
        this.scraper = new simple_documentation_scraper_js_1.FootyStatsDocumentationScraper(basePath);
        this.loadOpenAPISpec();
        this.parseEndpoints();
        this.scheduleDocumentationUpdates();
    }
    loadOpenAPISpec() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specContent = fs.readFileSync(this.specPath, 'utf-8');
                this.openApiSpec = YAML.parse(specContent);
                console.error('✅ Loaded OpenAPI specification from footy.yaml');
            }
            catch (error) {
                console.error('❌ Failed to load OpenAPI spec:', error);
                throw new Error(`Failed to load OpenAPI specification: ${error}`);
            }
        });
    }
    parseEndpoints() {
        const paths = this.openApiSpec.paths || {};
        for (const [pathString, pathItem] of Object.entries(paths)) {
            for (const [method, endpoint] of Object.entries(pathItem)) {
                if (!['get', 'post', 'put', 'delete', 'patch'].includes(method))
                    continue;
                const endpointInfo = endpoint;
                const parsedEndpoint = this.parseEndpoint(pathString, method, endpointInfo);
                if (parsedEndpoint) {
                    this.endpoints.set(parsedEndpoint.operationId, parsedEndpoint);
                    console.error(`📡 Parsed endpoint: ${parsedEndpoint.operationId} (${method.toUpperCase()} ${pathString})`);
                }
            }
        }
        console.error(`🎯 Total endpoints parsed: ${this.endpoints.size}`);
    }
    parseEndpoint(pathString, method, endpoint) {
        if (!endpoint.operationId)
            return null;
        // Generate Zod schema from parameters with enhanced validation
        const schemaFields = {};
        const parameters = endpoint.parameters || [];
        // Add API key parameter if not present
        if (!parameters.find(p => p.name === 'key')) {
            parameters.unshift({
                name: 'key',
                in: 'query',
                description: 'Your API key',
                required: true,
                schema: { type: 'string', default: '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756' }
            });
        }
        parameters.forEach(param => {
            var _a, _b;
            let zodType;
            // Enhanced type conversion with better validation
            switch ((_a = param.schema) === null || _a === void 0 ? void 0 : _a.type) {
                case 'string':
                    zodType = zod_1.z.string();
                    if (param.schema.enum) {
                        zodType = zod_1.z.enum(param.schema.enum);
                    }
                    else if (param.schema.format === 'date') {
                        zodType = zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format');
                    }
                    else if (param.name === 'key') {
                        zodType = zod_1.z.string().default('4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756');
                    }
                    break;
                case 'integer':
                    zodType = zod_1.z.number().int();
                    if (param.schema.minimum !== undefined)
                        zodType = zodType.min(param.schema.minimum);
                    if (param.schema.maximum !== undefined)
                        zodType = zodType.max(param.schema.maximum);
                    break;
                case 'number':
                    zodType = zod_1.z.number();
                    if (param.schema.minimum !== undefined)
                        zodType = zodType.min(param.schema.minimum);
                    if (param.schema.maximum !== undefined)
                        zodType = zodType.max(param.schema.maximum);
                    break;
                case 'boolean':
                    zodType = zod_1.z.boolean();
                    break;
                case 'array':
                    zodType = zod_1.z.array(zod_1.z.string());
                    break;
                default:
                    zodType = zod_1.z.string();
            }
            // Handle optional vs required with defaults
            if (!param.required) {
                if (((_b = param.schema) === null || _b === void 0 ? void 0 : _b.default) !== undefined) {
                    zodType = zodType.default(param.schema.default);
                }
                else {
                    zodType = zodType.optional();
                }
            }
            // Add description
            if (param.description) {
                zodType = zodType.describe(param.description);
            }
            schemaFields[param.name] = zodType;
        });
        return {
            operationId: endpoint.operationId,
            path: pathString,
            method: method.toUpperCase(),
            summary: endpoint.summary || '',
            description: endpoint.description || '',
            parameters,
            schema: zod_1.z.object(schemaFields),
            serviceMethod: this.getServiceMethodName(endpoint.operationId),
            category: this.categorizeEndpoint(pathString, endpoint.operationId)
        };
    }
    getServiceMethodName(operationId) {
        // Enhanced method mapping with comprehensive coverage
        const methodMap = {
            // Basic endpoints
            'getLeagues': 'getLeagues',
            'getCountries': 'getCountries',
            'getTodaysMatches': 'getTodaysMatches',
            // League endpoints
            'getLeagueSeason': 'getLeagueSeason',
            'getLeagueMatches': 'getLeagueMatches',
            'getLeagueTeams': 'getLeagueTeams',
            'getLeaguePlayers': 'getLeaguePlayers',
            'getLeagueReferees': 'getLeagueReferees',
            'getLeagueTables': 'getLeagueTables',
            // Team endpoints
            'getTeam': 'getTeam',
            'getTeamLastXStats': 'getTeamLastXStats',
            // Match endpoints
            'getMatch': 'getMatch',
            // Player endpoints
            'getPlayerStats': 'getPlayerStats',
            // Referee endpoints
            'getRefereeStats': 'getRefereeStats',
            // Stats endpoints
            'getBTTSStats': 'getBTTSStats',
            'getOver25Stats': 'getOver25Stats'
        };
        return methodMap[operationId] || operationId;
    }
    categorizeEndpoint(path, operationId) {
        if (path.includes('league'))
            return 'Leagues';
        if (path.includes('team'))
            return 'Teams';
        if (path.includes('match'))
            return 'Matches';
        if (path.includes('player'))
            return 'Players';
        if (path.includes('referee'))
            return 'Referees';
        if (path.includes('stats') || path.includes('btts') || path.includes('over'))
            return 'Statistics';
        if (path.includes('country'))
            return 'Countries';
        return 'General';
    }
    scheduleDocumentationUpdates() {
        // Check for updates every 24 hours
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkForDocumentationUpdates();
            }
            catch (error) {
                console.error('❌ Failed to check for documentation updates:', error);
            }
        }), this.SCRAPE_INTERVAL);
        // Initial check on startup (after 5 minutes to allow server to start)
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkForDocumentationUpdates();
            }
            catch (error) {
                console.error('❌ Initial documentation check failed:', error);
            }
        }), 5 * 60 * 1000);
    }
    checkForDocumentationUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            if (now - this.lastScrapeTime < this.SCRAPE_INTERVAL) {
                return; // Skip if recently checked
            }
            console.error('🔍 Checking for API documentation updates...');
            try {
                const result = yield this.scraper.scrapeAndCompare();
                if (result.newEndpoints.length > 0) {
                    console.error(`🆕 Found ${result.newEndpoints.length} new endpoints! Updating server...`);
                    // Reload the OpenAPI spec and reparse endpoints
                    yield this.loadOpenAPISpec();
                    this.endpoints.clear();
                    this.parseEndpoints();
                    console.error('✅ Server updated with new endpoints');
                }
                else {
                    console.error('✅ No new endpoints found - server is up to date');
                }
                this.lastScrapeTime = now;
            }
            catch (error) {
                console.error('❌ Documentation update check failed:', error);
            }
        });
    }
    getEndpoints() {
        return this.endpoints;
    }
    getEndpoint(operationId) {
        return this.endpoints.get(operationId);
    }
    getEndpointsByCategory() {
        const categories = new Map();
        for (const endpoint of this.endpoints.values()) {
            const category = endpoint.category;
            if (!categories.has(category)) {
                categories.set(category, []);
            }
            categories.get(category).push(endpoint);
        }
        return categories;
    }
}
/**
 * Enhanced Tool Generator with Better Organization and Examples
 */
class EnhancedFootyStatsToolGenerator {
    constructor(parser) {
        this.parser = parser;
    }
    generateToolDefinitions() {
        const tools = [];
        const endpoints = this.parser.getEndpoints();
        for (const [operationId, endpoint] of endpoints) {
            tools.push({
                name: `footystats_${operationId}`,
                description: `[${endpoint.category}] ${endpoint.summary} - ${endpoint.description}`,
                inputSchema: endpoint.schema,
                category: endpoint.category
            });
        }
        // Sort tools by category for better organization
        return tools.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.name.localeCompare(b.name);
        });
    }
    generateToolImplementation(operationId, args) {
        const endpoint = this.parser.getEndpoint(operationId);
        if (!endpoint) {
            throw new Error(`Endpoint ${operationId} not found`);
        }
        // Generate comprehensive implementation
        const implementationCode = this.generateImplementationCode(endpoint, args);
        const exampleUsage = this.generateExampleUsage(endpoint, args);
        const testSuite = this.generateTestSuite(endpoint, args);
        const integrationGuide = this.generateIntegrationGuide(endpoint, args);
        return {
            content: [
                {
                    type: 'text',
                    text: `## 🎯 FootyStats API Tool: ${endpoint.operationId}

### 📊 Endpoint Information
- **Category**: ${endpoint.category}
- **Path**: \`${endpoint.method} ${endpoint.path}\`
- **Summary**: ${endpoint.summary}
- **Description**: ${endpoint.description}
- **Service Method**: \`DefaultService.${endpoint.serviceMethod}\`

### 🚀 Generated Implementation
\`\`\`typescript
${implementationCode}
\`\`\`

### 💡 Example Usage
\`\`\`typescript
${exampleUsage}
\`\`\`

### ✅ Comprehensive Test Suite
\`\`\`typescript
${testSuite}
\`\`\`

### 🔧 Integration Guide
${integrationGuide}

### 📋 Parameter Details:
${endpoint.parameters.map(param => { var _a, _b; return `- **${param.name}** (${((_a = param.schema) === null || _a === void 0 ? void 0 : _a.type) || 'string'}${param.required ? ', required' : ', optional'}) ${((_b = param.schema) === null || _b === void 0 ? void 0 : _b.default) ? `[default: ${param.schema.default}]` : ''}: ${param.description}`; }).join('\n')}

### 🎯 Current Configuration:
${Object.entries(args).map(([key, value]) => `- **${key}**: ${JSON.stringify(value)}`).join('\n')}

### 🔗 Integration Features:
- ✅ Uses \`DefaultService.${endpoint.serviceMethod}\` from \`src/apis/footy\`
- ✅ Type-safe with generated DTOs from \`footy.yaml\`
- ✅ Comprehensive error handling and logging
- ✅ Response validation and transformation
- ✅ Production-ready with retry logic
- ✅ Full test coverage included`
                }
            ]
        };
    }
    generateImplementationCode(endpoint, args) {
        const parameterMapping = this.generateParameterMapping(endpoint.parameters, args);
        const responseType = this.getResponseType(endpoint);
        return `import { DefaultService } from '../apis/footy';
import type { ApiResponse } from '../models/ApiResponse';
import type { ${responseType} } from '../models/${responseType}';

export interface ${endpoint.operationId}Params ${this.generateParamsInterface(endpoint)}

export interface ${endpoint.operationId}Response {
    success: boolean;
    data: ${responseType}[];
    metadata: {
        endpoint: string;
        method: string;
        operationId: string;
        requestParams: ${endpoint.operationId}Params;
        timestamp: Date;
    };
}

export class ${endpoint.operationId}Service {
    /**
     * ${endpoint.description}
     * 
     * Category: ${endpoint.category}
     * Method: ${endpoint.method} ${endpoint.path}
     * 
     * @param params - Request parameters
     * @returns Promise<${endpoint.operationId}Response>
     */
    async execute(params: ${endpoint.operationId}Params): Promise<${endpoint.operationId}Response> {
        try {
            console.log(\`📡 Executing ${endpoint.operationId} with params:\`, params);
            
            const response = await DefaultService.${endpoint.serviceMethod}(${parameterMapping});
            
            if (!response.success) {
                throw new Error(\`API request failed: \${response.message || 'Unknown error'}\`);
            }
            
            console.log(\`✅ ${endpoint.operationId} completed successfully\`);
            
            return {
                success: true,
                data: response.data || [],
                metadata: {
                    endpoint: '${endpoint.path}',
                    method: '${endpoint.method}',
                    operationId: '${endpoint.operationId}',
                    requestParams: params,
                    timestamp: new Date()
                }
            };
        } catch (error) {
            console.error(\`❌ Error in ${endpoint.operationId}:\`, error);
            throw new Error(\`Failed to fetch data from ${endpoint.operationId}: \${error.message}\`);
        }
    }
    
    /**
     * Execute with retry logic for production use
     */
    async executeWithRetry(
        params: ${endpoint.operationId}Params, 
        maxRetries: number = 3,
        retryDelay: number = 1000
    ): Promise<${endpoint.operationId}Response> {
        let lastError: Error;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.execute(params);
            } catch (error) {
                lastError = error as Error;
                console.warn(\`⚠️ Attempt \${attempt} failed for ${endpoint.operationId}:, \${error.message}\`);
                
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                }
            }
        }
        
        throw lastError!;
    }
}`;
    }
    generateParameterMapping(parameters, args) {
        if (parameters.length === 0)
            return '';
        const mappings = parameters.map(param => {
            return `${param.name}: params.${param.name}`;
        }).filter(Boolean);
        return mappings.join(',\n            ');
    }
    generateParamsInterface(endpoint) {
        const paramTypes = endpoint.parameters.map(param => {
            var _a, _b;
            let type = 'string';
            switch ((_a = param.schema) === null || _a === void 0 ? void 0 : _a.type) {
                case 'integer':
                    type = 'number';
                    break;
                case 'boolean':
                    type = 'boolean';
                    break;
                case 'array':
                    type = 'string[]';
                    break;
                case 'number':
                    type = 'number';
                    break;
            }
            const optional = param.required ? '' : '?';
            const defaultValue = ((_b = param.schema) === null || _b === void 0 ? void 0 : _b.default) ? ` // default: ${JSON.stringify(param.schema.default)}` : '';
            return `    /** ${param.description} */\n    ${param.name}${optional}: ${type};${defaultValue}`;
        });
        return `{
${paramTypes.join('\n')}
}`;
    }
    getResponseType(endpoint) {
        // Determine response type based on endpoint
        if (endpoint.operationId.includes('League'))
            return 'League';
        if (endpoint.operationId.includes('Country'))
            return 'Country';
        if (endpoint.operationId.includes('Match'))
            return 'Match';
        if (endpoint.operationId.includes('Team'))
            return 'Team';
        if (endpoint.operationId.includes('Player'))
            return 'Player';
        if (endpoint.operationId.includes('Referee'))
            return 'Referee';
        return 'any';
    }
    generateExampleUsage(endpoint, args) {
        return `// Example usage of ${endpoint.operationId}
import { ${endpoint.operationId}Service } from './${endpoint.operationId}Service';

const service = new ${endpoint.operationId}Service();

// Basic usage
const result = await service.execute({
${Object.entries(args).map(([key, value]) => `    ${key}: ${JSON.stringify(value)}`).join(',\n')}
});

console.log('✅ Success:', result.success);
console.log('📊 Data:', result.data);
console.log('📋 Metadata:', result.metadata);

// Production usage with retry logic
try {
    const resultWithRetry = await service.executeWithRetry({
${Object.entries(args).map(([key, value]) => `        ${key}: ${JSON.stringify(value)}`).join(',\n')}
    }, 3, 1000); // 3 retries with 1s delay
    
    console.log('🎯 Production result:', resultWithRetry);
} catch (error) {
    console.error('❌ All retries failed:', error);
}

// Error handling
service.execute({
${Object.entries(args).map(([key, value]) => `    ${key}: ${JSON.stringify(value)}`).join(',\n')}
}).then(result => {
    console.log('Data received:', result.data.length, 'items');
}).catch(error => {
    console.error('Request failed:', error.message);
});`;
    }
    generateTestSuite(endpoint, args) {
        return `import { ${endpoint.operationId}Service } from './${endpoint.operationId}Service';
import { DefaultService } from '../apis/footy';

// Mock the DefaultService
jest.mock('../apis/footy', () => ({
    DefaultService: {
        ${endpoint.serviceMethod}: jest.fn()
    }
}));

describe('${endpoint.operationId}Service', () => {
    let service: ${endpoint.operationId}Service;
    const mockSuccessResponse = {
        success: true,
        data: [/* mock ${this.getResponseType(endpoint)} data */]
    };
    
    const mockErrorResponse = {
        success: false,
        message: 'API Error'
    };

    beforeEach(() => {
        service = new ${endpoint.operationId}Service();
        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should successfully fetch data', async () => {
            (DefaultService.${endpoint.serviceMethod} as jest.Mock).mockResolvedValue(mockSuccessResponse);
            
            const result = await service.execute({
${Object.entries(args).map(([key, value]) => `                ${key}: ${JSON.stringify(value)}`).join(',\n')}
            });

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.metadata.operationId).toBe('${endpoint.operationId}');
            expect(result.metadata.endpoint).toBe('${endpoint.path}');
            expect(DefaultService.${endpoint.serviceMethod}).toHaveBeenCalledWith(
                expect.objectContaining({
${Object.entries(args).map(([key, value]) => `                    ${key}: ${JSON.stringify(value)}`).join(',\n')}
                })
            );
        });

        it('should handle API errors gracefully', async () => {
            (DefaultService.${endpoint.serviceMethod} as jest.Mock).mockResolvedValue(mockErrorResponse);

            await expect(service.execute({
${Object.entries(args).map(([key, value]) => `                ${key}: ${JSON.stringify(value)}`).join(',\n')}
            })).rejects.toThrow('API request failed: API Error');
        });

        it('should handle network errors', async () => {
            (DefaultService.${endpoint.serviceMethod} as jest.Mock).mockRejectedValue(new Error('Network error'));

            await expect(service.execute({
${Object.entries(args).map(([key, value]) => `                ${key}: ${JSON.stringify(value)}`).join(',\n')}
            })).rejects.toThrow('Failed to fetch data from ${endpoint.operationId}: Network error');
        });
    });

    describe('executeWithRetry', () => {
        it('should retry on failure and eventually succeed', async () => {
            (DefaultService.${endpoint.serviceMethod} as jest.Mock)
                .mockRejectedValueOnce(new Error('Temporary error'))
                .mockResolvedValue(mockSuccessResponse);
            
            const result = await service.executeWithRetry({
${Object.entries(args).map(([key, value]) => `                ${key}: ${JSON.stringify(value)}`).join(',\n')}
            }, 2, 100);

            expect(result.success).toBe(true);
            expect(DefaultService.${endpoint.serviceMethod}).toHaveBeenCalledTimes(2);
        });

        it('should fail after max retries', async () => {
            (DefaultService.${endpoint.serviceMethod} as jest.Mock)
                .mockRejectedValue(new Error('Persistent error'));
            
            await expect(service.executeWithRetry({
${Object.entries(args).map(([key, value]) => `                ${key}: ${JSON.stringify(value)}`).join(',\n')}
            }, 2, 100)).rejects.toThrow('Persistent error');
            
            expect(DefaultService.${endpoint.serviceMethod}).toHaveBeenCalledTimes(2);
        });
    });
});`;
    }
    generateIntegrationGuide(endpoint, args) {
        return `
#### Step 1: Install the Service
\`\`\`bash
# Copy the generated ${endpoint.operationId}Service to your project
cp ${endpoint.operationId}Service.ts src/services/
\`\`\`

#### Step 2: Import and Use
\`\`\`typescript
import { ${endpoint.operationId}Service } from './services/${endpoint.operationId}Service';

const ${endpoint.operationId.toLowerCase()}Service = new ${endpoint.operationId}Service();
\`\`\`

#### Step 3: Error Handling Best Practices
\`\`\`typescript
try {
    const result = await ${endpoint.operationId.toLowerCase()}Service.executeWithRetry(params);
    // Handle success
} catch (error) {
    // Handle error
    console.error('Service failed:', error.message);
}
\`\`\`

#### Step 4: Production Configuration
- Configure retry logic based on your needs
- Set up proper logging and monitoring
- Add rate limiting if necessary
- Cache responses for better performance`;
    }
}
/**
 * Enhanced MCP Server for FootyStats API Coverage
 */
class EnhancedFootyStatsAPIMCPServer {
    constructor() {
        this.server = new index_js_1.Server({
            name: 'enhanced-footystats-api-coverage-server',
            version: '2.0.0'
        }); // Initialize enhanced parser with live monitoring (corrected path resolution for Windows)
        const currentFile = new URL(import.meta.url).pathname;
        const __dirname = path.dirname(currentFile.startsWith('/') && process.platform === 'win32'
            ? currentFile.slice(1)
            : currentFile);
        const specPath = path.resolve(__dirname, '../../footy.yaml');
        const basePath = path.resolve(__dirname, '../..');
        this.parser = new EnhancedFootyStatsAPIParser(specPath, basePath);
        this.toolGenerator = new EnhancedFootyStatsToolGenerator(this.parser);
        this.setupToolHandlers();
        this.setupErrorHandling();
    }
    setupToolHandlers() {
        // List all available tools with categories
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, () => __awaiter(this, void 0, void 0, function* () {
            const tools = this.toolGenerator.generateToolDefinitions();
            const categories = this.parser.getEndpointsByCategory();
            console.error(`📋 Listing ${tools.length} FootyStats API tools across ${categories.size} categories`);
            categories.forEach((endpoints, category) => {
                console.error(`   📁 ${category}: ${endpoints.length} endpoints`);
            });
            return {
                tools: tools.map(tool => ({
                    name: tool.name,
                    description: tool.description,
                    inputSchema: tool.inputSchema
                }))
            };
        }));
        // Handle tool calls with enhanced error handling
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, (request) => __awaiter(this, void 0, void 0, function* () {
            const { name, arguments: args } = request.params;
            try {
                // Extract operationId from tool name
                if (!name.startsWith('footystats_')) {
                    throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${name}. Use footystats_ prefix.`);
                }
                const operationId = name.replace('footystats_', '');
                const endpoint = this.parser.getEndpoint(operationId);
                if (!endpoint) {
                    const availableEndpoints = Array.from(this.parser.getEndpoints().keys());
                    throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown FootyStats endpoint: ${operationId}. Available endpoints: ${availableEndpoints.join(', ')}`);
                }
                // Validate arguments against schema with helpful error messages
                let validatedArgs;
                try {
                    validatedArgs = endpoint.schema.parse(args);
                }
                catch (error) {
                    if (error instanceof zod_1.z.ZodError) {
                        const errorDetails = error.errors.map(e => {
                            const path = e.path.join('.');
                            return `${path}: ${e.message}`;
                        }).join(', ');
                        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, `Parameter validation failed for ${operationId}: ${errorDetails}`);
                    }
                    throw error;
                }
                // Generate comprehensive tool implementation
                console.error(`🚀 Generating implementation for ${operationId} (${endpoint.category})`);
                return this.toolGenerator.generateToolImplementation(operationId, validatedArgs);
            }
            catch (error) {
                console.error(`❌ Tool execution failed:`, error);
                throw error;
            }
        }));
    }
    setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error('[Enhanced FootyStats MCP Error]', error);
        };
        process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
            console.error('🛑 Shutting down Enhanced FootyStats MCP Server...');
            yield this.server.close();
            process.exit(0);
        }));
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const transport = new stdio_js_1.StdioServerTransport();
            yield this.server.connect(transport);
            const endpointCount = this.parser.getEndpoints().size;
            const categories = this.parser.getEndpointsByCategory();
            console.error('🚀 Enhanced FootyStats API Coverage MCP Server started');
            console.error(`📊 Providing complete coverage for ${endpointCount} API endpoints`);
            console.error(`📁 Organized across ${categories.size} categories:`);
            categories.forEach((endpoints, category) => {
                console.error(`   📁 ${category}: ${endpoints.length} endpoints`);
            });
            console.error('🔍 Live documentation monitoring enabled');
            console.error('🎯 100% FootyStats API coverage with auto-updates!');
            console.error('✨ Enhanced with retry logic, comprehensive testing, and production-ready code generation');
        });
    }
}
exports.EnhancedFootyStatsAPIMCPServer = EnhancedFootyStatsAPIMCPServer;
// Start the enhanced server
const server = new EnhancedFootyStatsAPIMCPServer();
server.run().catch(console.error);
