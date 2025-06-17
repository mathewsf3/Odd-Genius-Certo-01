"use strict";
/**
 * Simplified FootyStats API Documentation Scraper
 * Monitors live API documentation for new endpoints and updates
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootyStatsDocumentationScraper = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const YAML = __importStar(require("yaml"));
class FootyStatsDocumentationScraper {
    constructor(basePath) {
        this.DOCS_URL = 'https://footystats.org/api/documentations/';
        this.API_MD_PATH = path.join(basePath, 'api.md');
        this.FOOTY_YAML_PATH = path.join(basePath, 'footy.yaml');
    }
    /**
     * Scrape live documentation and compare with existing specs
     */
    scrapeAndCompare() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[INFO] Scraping live FootyStats API documentation...');
            try {
                // Scrape live documentation
                const liveEndpoints = yield this.scrapeLiveDocumentation();
                // Parse existing api.md file
                const apiMdEndpoints = yield this.parseApiMdFile();
                // Parse footy.yaml spec
                const specEndpoints = yield this.parseFootyYamlFile();
                // Compare and find differences
                const comparison = this.compareEndpoints(liveEndpoints, specEndpoints, apiMdEndpoints);
                // Update specifications if new endpoints found
                if (comparison.newEndpoints.length > 0) {
                    console.log('[UPDATE] Found ' + comparison.newEndpoints.length + ' new endpoints, updating specifications...');
                    yield this.updateSpecifications(comparison.newEndpoints);
                }
                return comparison;
            }
            catch (error) {
                console.error('[ERROR] Error during documentation scraping:', error);
                return {
                    newEndpoints: [],
                    missingFromSpec: [],
                    currentEndpoints: this.getFallbackEndpoints()
                };
            }
        });
    }
    /**
     * Scrape live API documentation from FootyStats
     */
    scrapeLiveDocumentation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(this.DOCS_URL, {
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                // Simple HTML parsing to extract endpoint information
                const html = response.data;
                const endpoints = [];
                // Extract endpoints using regex patterns (simplified approach)
                const endpointPattern = /<div[^>]*class="endpoint"[^>]*>(.*?)<\/div>/gs;
                const matches = html.match(endpointPattern) || [];
                matches.forEach((match) => {
                    try {
                        const endpoint = this.parseEndpointFromHtml(match);
                        if (endpoint) {
                            endpoints.push(endpoint);
                        }
                    }
                    catch (parseError) {
                        console.warn('[WARN] Failed to parse endpoint:', parseError);
                    }
                });
                console.log('[SUCCESS] Scraped ' + endpoints.length + ' endpoints from live documentation');
                return endpoints.length > 0 ? endpoints : this.getFallbackEndpoints();
            }
            catch (error) {
                console.warn('[WARN] Could not scrape live documentation, using fallback endpoints');
                return this.getFallbackEndpoints();
            }
        });
    }
    /**
     * Parse endpoint information from HTML
     */
    parseEndpointFromHtml(html) {
        try {
            // Extract basic information using regex
            const nameMatch = html.match(/<h3[^>]*>(.*?)<\/h3>/);
            const methodMatch = html.match(/method[^>]*>([^<]+)</i);
            const urlMatch = html.match(/url[^>]*>([^<]+)</i);
            const descMatch = html.match(/<p[^>]*class="description"[^>]*>(.*?)<\/p>/s);
            if (!nameMatch || !methodMatch || !urlMatch) {
                return null;
            }
            return {
                name: nameMatch[1].trim(),
                method: methodMatch[1].trim().toUpperCase(),
                url: urlMatch[1].trim(),
                description: descMatch ? descMatch[1].trim() : '',
                parameters: [],
                exampleResponse: ''
            };
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Parse existing api.md file
     */
    parseApiMdFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fs.existsSync(this.API_MD_PATH)) {
                    return [];
                }
                const content = fs.readFileSync(this.API_MD_PATH, 'utf-8');
                const endpoints = [];
                // Parse markdown format endpoints
                const endpointPattern = /## (.+?)\n.*?### (.+?)\n.*?URL: `(.+?)`/gs;
                let match;
                while ((match = endpointPattern.exec(content)) !== null) {
                    endpoints.push({
                        name: match[1].trim(),
                        method: match[2].trim(),
                        url: match[3].trim(),
                        description: '',
                        parameters: [],
                        exampleResponse: ''
                    });
                }
                return endpoints;
            }
            catch (error) {
                console.warn('[WARN] Could not read api.md file:', error.message);
                return [];
            }
        });
    }
    /**
     * Parse existing footy.yaml specification
     */
    parseFootyYamlFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fs.existsSync(this.FOOTY_YAML_PATH)) {
                    return [];
                }
                const content = fs.readFileSync(this.FOOTY_YAML_PATH, 'utf-8');
                const spec = YAML.parse(content);
                const endpoints = [];
                if (spec.paths) {
                    Object.entries(spec.paths).forEach(([path, pathItem]) => {
                        Object.entries(pathItem).forEach(([method, operation]) => {
                            if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
                                endpoints.push({
                                    name: operation.operationId || `${method}_${path}`,
                                    method: method.toUpperCase(),
                                    url: path,
                                    description: operation.summary || operation.description || '',
                                    parameters: operation.parameters || [],
                                    exampleResponse: ''
                                });
                            }
                        });
                    });
                }
                return endpoints;
            }
            catch (error) {
                console.warn('[WARN] Could not read footy.yaml file:', error.message);
                return [];
            }
        });
    }
    /**
     * Compare endpoints and find differences
     */
    compareEndpoints(liveEndpoints, specEndpoints, apiMdEndpoints) {
        const specUrls = new Set(specEndpoints.map(e => this.normalizeUrl(e.url)));
        const apiMdUrls = new Set(apiMdEndpoints.map(e => this.normalizeUrl(e.url)));
        const newEndpoints = liveEndpoints.filter(endpoint => !specUrls.has(this.normalizeUrl(endpoint.url)) &&
            !apiMdUrls.has(this.normalizeUrl(endpoint.url)));
        const missingFromSpec = liveEndpoints.filter(endpoint => !specUrls.has(this.normalizeUrl(endpoint.url)));
        return {
            newEndpoints,
            missingFromSpec,
            currentEndpoints: liveEndpoints
        };
    }
    /**
     * Normalize URL for comparison
     */
    normalizeUrl(url) {
        return url.replace(/^https?:\/\/[^\/]+/, '').replace(/\/$/, '').toLowerCase();
    }
    /**
     * Update both footy.yaml and api.md with new endpoints
     */
    updateSpecifications(newEndpoints) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateFootyYaml(newEndpoints);
            yield this.updateApiMd(newEndpoints);
        });
    }
    /**
     * Update footy.yaml with new endpoints
     */
    updateFootyYaml(newEndpoints) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = fs.readFileSync(this.FOOTY_YAML_PATH, 'utf-8');
                const spec = YAML.parse(content);
                if (!spec.paths) {
                    spec.paths = {};
                }
                newEndpoints.forEach(endpoint => {
                    const pathKey = this.normalizeUrl(endpoint.url);
                    if (!spec.paths[pathKey]) {
                        spec.paths[pathKey] = {};
                    }
                    spec.paths[pathKey][endpoint.method.toLowerCase()] = {
                        operationId: this.generateOperationId(endpoint.name),
                        summary: endpoint.description,
                        description: endpoint.description,
                        parameters: this.convertParametersToOpenAPI(endpoint.parameters),
                        responses: {
                            '200': {
                                description: 'Successful response',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object'
                                        }
                                    }
                                }
                            }
                        }
                    };
                });
                const updatedYaml = YAML.stringify(spec, { indent: 2 });
                fs.writeFileSync(this.FOOTY_YAML_PATH, updatedYaml);
                console.log('[SUCCESS] Updated footy.yaml with ' + newEndpoints.length + ' new endpoints');
            }
            catch (error) {
                console.error('[ERROR] Failed to update footy.yaml:', error);
            }
        });
    }
    /**
     * Update api.md with new endpoints
     */
    updateApiMd(newEndpoints) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let content = fs.readFileSync(this.API_MD_PATH, 'utf-8');
                newEndpoints.forEach(endpoint => {
                    const endpointDoc = `
## ${endpoint.name}

### ${endpoint.method}
URL: \`${endpoint.url}\`

**Description:** ${endpoint.description}

**Parameters:**
${endpoint.parameters.map(param => `- **${param.name}** (${param.type}${param.required ? ', required' : ''}): ${param.description}`).join('\n')}

---

`;
                    content += endpointDoc;
                });
                fs.writeFileSync(this.API_MD_PATH, content);
                console.log('[SUCCESS] Updated api.md with ' + newEndpoints.length + ' new endpoints');
            }
            catch (error) {
                console.error('[ERROR] Failed to update api.md:', error);
            }
        });
    }
    /**
     * Generate camelCase operationId from endpoint name
     */
    generateOperationId(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
            .replace(/^(.)/, char => char.toLowerCase());
    }
    /**
     * Convert parameters to OpenAPI format
     */
    convertParametersToOpenAPI(parameters) {
        return parameters.map(param => ({
            name: param.name,
            in: 'query',
            description: param.description,
            required: param.required,
            schema: {
                type: param.type === 'integer' ? 'integer' : 'string'
            }
        }));
    }
    /**
     * Fallback endpoints when scraping fails
     */
    getFallbackEndpoints() {
        return [
            {
                name: 'Get Leagues',
                method: 'GET',
                url: '/leagues',
                description: 'Get all available leagues',
                parameters: [],
                exampleResponse: ''
            },
            {
                name: 'Get Countries',
                method: 'GET',
                url: '/countries',
                description: 'Returns JSON array of Countries and ISO numbers',
                parameters: [],
                exampleResponse: ''
            },
            {
                name: 'Get Today\'s Matches',
                method: 'GET',
                url: '/matches',
                description: 'Get today\'s matches with or without stats',
                parameters: [
                    {
                        name: 'date',
                        type: 'string',
                        description: 'Date in YYYY-MM-DD format',
                        required: false
                    }
                ],
                exampleResponse: ''
            }
        ];
    }
}
exports.FootyStatsDocumentationScraper = FootyStatsDocumentationScraper;
