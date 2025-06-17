"use strict";
/**
 * FootyStats API Documentation Scraper
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
const cheerio = __importStar(require("cheerio"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
            console.log('🔍 Scraping live FootyStats API documentation...');
            try {
                // Scrape live documentation
                const liveEndpoints = yield this.scrapeLiveDocumentation();
                // Parse existing api.md file
                const apiMdEndpoints = yield this.parseApiMdFile();
                // Parse footy.yaml spec
                const specEndpoints = yield this.parseFootyYaml();
                // Compare and find differences
                const comparison = this.compareEndpoints(liveEndpoints, specEndpoints, apiMdEndpoints);
                console.log(`📊 Found ${liveEndpoints.length} endpoints in live documentation`);
                console.log(`📋 Found ${specEndpoints.length} endpoints in footy.yaml`);
                console.log(`📄 Found ${apiMdEndpoints.length} endpoints in api.md`);
                if (comparison.newEndpoints.length > 0) {
                    console.log(`🆕 Found ${comparison.newEndpoints.length} new endpoints!`);
                    yield this.updateSpecifications(comparison.newEndpoints);
                }
                return comparison;
            }
            catch (error) {
                console.error('❌ Failed to scrape documentation:', error);
                throw error;
            }
        });
    }
    scrapeLiveDocumentation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(this.DOCS_URL, {
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'FootyStats MCP Server/1.0.0'
                    }
                });
                const $ = cheerio.load(response.data);
                const endpoints = [];
                // Parse each endpoint section
                $('.endpoint-section, .api-endpoint, .documentation-section').each((_, element) => {
                    const endpoint = this.parseEndpointFromHtml($, element);
                    if (endpoint) {
                        endpoints.push(endpoint);
                    }
                });
                // Fallback: look for common patterns
                if (endpoints.length === 0) {
                    endpoints.push(...this.parseWithFallbackPatterns($));
                }
                return endpoints;
            }
            catch (error) {
                console.warn('⚠️ Failed to scrape live documentation, using fallback methods');
                return this.getFallbackEndpoints();
            }
        });
    }
    parseEndpointFromHtml($, element) {
        const $element = $(element);
        // Extract endpoint information from various HTML patterns
        const name = $element.find('h2, h3, .endpoint-title').first().text().trim();
        const method = this.extractMethod($element.text());
        const url = this.extractUrl($element.text());
        const description = $element.find('p, .description').first().text().trim();
        if (!name || !url)
            return null;
        const parameters = this.extractParameters($element);
        const exampleResponse = this.extractExampleResponse($element);
        return {
            name,
            method,
            url,
            description,
            parameters,
            exampleResponse
        };
    }
    parseWithFallbackPatterns($) {
        const endpoints = [];
        // Look for common API documentation patterns
        const patterns = [
            'h2:contains("GET"), h3:contains("GET")',
            'h2:contains("POST"), h3:contains("POST")',
            '.api-call, .endpoint, .method',
            'code:contains("api.football-data-api.com")'
        ];
        patterns.forEach(pattern => {
            $(pattern).each((_, element) => {
                const text = $(element).text();
                const endpoint = this.parseEndpointFromText(text);
                if (endpoint) {
                    endpoints.push(endpoint);
                }
            });
        });
        return endpoints;
    }
    parseEndpointFromText(text) {
        var _a;
        // Extract endpoint info from text using regex patterns
        const methodMatch = text.match(/(GET|POST|PUT|DELETE|PATCH)/i);
        const urlMatch = text.match(/https?:\/\/[^\s]+/);
        if (!methodMatch || !urlMatch)
            return null;
        return {
            name: ((_a = text.split('\n')[0]) === null || _a === void 0 ? void 0 : _a.trim()) || 'Unknown Endpoint',
            method: methodMatch[1].toUpperCase(),
            url: urlMatch[0],
            description: text.trim(),
            parameters: [],
            exampleResponse: ''
        };
    }
    extractMethod(text) {
        const match = text.match(/(GET|POST|PUT|DELETE|PATCH)/i);
        return match ? match[1].toUpperCase() : 'GET';
    }
    extractUrl(text) {
        const match = text.match(/https?:\/\/[^\s]+/);
        return match ? match[0] : '';
    }
    extractParameters($element) {
        const parameters = [];
        // Look for parameter tables or lists
        $element.find('table tbody tr, .parameter-list li, .param').each((_, paramElement) => {
            const $param = $(paramElement);
            const name = $param.find('td:first, .param-name, strong').first().text().trim();
            const type = $param.find('td:nth-child(2), .param-type').text().trim() || 'string';
            const description = $param.find('td:last, .param-description').text().trim();
            const required = $param.text().includes('required') || $param.text().includes('*');
            if (name) {
                parameters.push({ name, type, description, required });
            }
        });
        return parameters;
    }
    extractExampleResponse($element) {
        const codeBlocks = $element.find('pre, code, .example-response');
        return codeBlocks.first().text().trim();
    }
    parseApiMdFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = fs.readFileSync(this.API_MD_PATH, 'utf-8');
                return this.parseApiMdContent(content);
            }
            catch (error) {
                console.warn('⚠️ Could not read api.md file');
                return [];
            }
        });
    }
    parseApiMdContent(content) {
        const endpoints = [];
        const sections = content.split(/#{1,3}\s+/);
        sections.forEach(section => {
            var _a;
            const lines = section.split('\n');
            const title = (_a = lines[0]) === null || _a === void 0 ? void 0 : _a.trim();
            if (!title)
                return;
            const methodMatch = section.match(/(GET|POST|PUT|DELETE|PATCH)/i);
            const urlMatch = section.match(/https?:\/\/[^\s]+/);
            if (methodMatch && urlMatch) {
                endpoints.push({
                    name: title,
                    method: methodMatch[1].toUpperCase(),
                    url: urlMatch[0],
                    description: section.split('\n').slice(1, 3).join(' ').trim(),
                    parameters: this.extractParametersFromMd(section),
                    exampleResponse: this.extractResponseFromMd(section)
                });
            }
        });
        return endpoints;
    }
    extractParametersFromMd(section) {
        const parameters = [];
        const lines = section.split('\n');
        let inParamsSection = false;
        lines.forEach(line => {
            if (line.toLowerCase().includes('parameter') || line.toLowerCase().includes('query')) {
                inParamsSection = true;
                return;
            }
            if (inParamsSection && line.trim()) {
                const paramMatch = line.match(/(\w+)\s*[\|\-\s]*(\w+)?\s*[\|\-\s]*(.*)/);
                if (paramMatch) {
                    parameters.push({
                        name: paramMatch[1],
                        type: paramMatch[2] || 'string',
                        description: paramMatch[3] || '',
                        required: line.includes('*') || line.toLowerCase().includes('required')
                    });
                }
            }
        });
        return parameters;
    }
    extractResponseFromMd(section) {
        const responseMatch = section.match(/```[\s\S]*?```/);
        return responseMatch ? responseMatch[0] : '';
    }
    parseFootyYaml() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const content = fs.readFileSync(this.FOOTY_YAML_PATH, 'utf-8');
                const yaml = require('yaml');
                const spec = yaml.parse(content);
                const endpoints = [];
                const paths = spec.paths || {};
                for (const [path, methods] of Object.entries(paths)) {
                    for (const [method, details] of Object.entries(methods)) {
                        if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
                            endpoints.push({
                                name: details.operationId || `${method} ${path}`,
                                method: method.toUpperCase(),
                                url: `${((_b = (_a = spec.servers) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) || ''}${path}`,
                                description: details.description || details.summary || '',
                                parameters: (details.parameters || []).map((param) => {
                                    var _a;
                                    return ({
                                        name: param.name,
                                        type: ((_a = param.schema) === null || _a === void 0 ? void 0 : _a.type) || 'string',
                                        description: param.description || '',
                                        required: param.required || false
                                    });
                                }),
                                exampleResponse: ''
                            });
                        }
                    }
                }
                return endpoints;
            }
            catch (error) {
                console.warn('⚠️ Could not read footy.yaml file');
                return [];
            }
        });
    }
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
    normalizeUrl(url) {
        return url.replace(/^https?:\/\/[^\/]+/, '').replace(/\?.*$/, '');
    }
    updateSpecifications(newEndpoints) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('📝 Updating specifications with new endpoints...');
            // Update footy.yaml
            yield this.updateFootyYaml(newEndpoints);
            // Update api.md
            yield this.updateApiMd(newEndpoints);
            console.log('✅ Specifications updated successfully');
        });
    }
    updateFootyYaml(newEndpoints) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const yaml = require('yaml');
                const content = fs.readFileSync(this.FOOTY_YAML_PATH, 'utf-8');
                const spec = yaml.parse(content);
                // Add new endpoints to the spec
                newEndpoints.forEach(endpoint => {
                    const pathKey = this.normalizeUrl(endpoint.url);
                    if (!spec.paths[pathKey]) {
                        spec.paths[pathKey] = {};
                    }
                    spec.paths[pathKey][endpoint.method.toLowerCase()] = {
                        operationId: this.generateOperationId(endpoint.name),
                        summary: endpoint.name,
                        description: endpoint.description,
                        parameters: this.convertParametersToOpenAPI(endpoint.parameters),
                        responses: {
                            '200': {
                                description: 'Successful response',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/ApiResponse' }
                                    }
                                }
                            }
                        }
                    };
                });
                // Write updated spec
                const updatedYaml = yaml.stringify(spec);
                fs.writeFileSync(this.FOOTY_YAML_PATH, updatedYaml);
            }
            catch (error) {
                console.error('❌ Failed to update footy.yaml:', error);
            }
        });
    }
    updateApiMd(newEndpoints) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let content = fs.readFileSync(this.API_MD_PATH, 'utf-8');
                // Append new endpoints
                newEndpoints.forEach(endpoint => {
                    content += `\n\n## ${endpoint.name}\n`;
                    content += `${endpoint.method} ${endpoint.url}\n`;
                    content += `${endpoint.description}\n\n`;
                    if (endpoint.parameters.length > 0) {
                        content += `### Parameters\n`;
                        endpoint.parameters.forEach(param => {
                            content += `- **${param.name}** (${param.type}${param.required ? ', required' : ''}): ${param.description}\n`;
                        });
                    }
                });
                fs.writeFileSync(this.API_MD_PATH, content);
            }
            catch (error) {
                console.error('❌ Failed to update api.md:', error);
            }
        });
    }
    generateOperationId(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }
    convertParametersToOpenAPI(parameters) {
        return parameters.map(param => ({
            name: param.name,
            in: 'query',
            description: param.description,
            required: param.required,
            schema: {
                type: param.type === 'integer' ? 'integer' :
                    param.type === 'boolean' ? 'boolean' :
                        param.type === 'number' ? 'number' : 'string'
            }
        }));
    }
    getFallbackEndpoints() {
        // Return known endpoints as fallback
        return [
            {
                name: 'Get Leagues',
                method: 'GET',
                url: 'https://api.football-data-api.com/league-list',
                description: 'Returns a JSON array of all leagues available in the API Database',
                parameters: [
                    { name: 'key', type: 'string', description: 'Your API key', required: true },
                    { name: 'chosen_leagues_only', type: 'string', description: 'If set to "true", only return user-chosen leagues', required: false },
                    { name: 'country', type: 'integer', description: 'ISO number of the country to filter leagues', required: false }
                ],
                exampleResponse: ''
            },
            {
                name: 'Get Countries',
                method: 'GET',
                url: 'https://api.football-data-api.com/country-list',
                description: 'Returns a JSON array of Countries and their ISO numbers',
                parameters: [
                    { name: 'key', type: 'string', description: 'Your API key', required: true }
                ],
                exampleResponse: ''
            },
            {
                name: 'Get Today\'s Matches',
                method: 'GET',
                url: 'https://api.football-data-api.com/todays-matches',
                description: 'Get a list of today\'s matches with or without stats',
                parameters: [
                    { name: 'key', type: 'string', description: 'Your API key', required: true },
                    { name: 'timezone', type: 'string', description: 'Timezone (e.g., Europe/London)', required: false },
                    { name: 'date', type: 'string', description: 'Date in YYYY-MM-DD format', required: false }
                ],
                exampleResponse: ''
            }
        ];
    }
}
exports.FootyStatsDocumentationScraper = FootyStatsDocumentationScraper;
