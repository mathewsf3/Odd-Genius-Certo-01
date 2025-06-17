/**
 * FootyStats API Documentation Scraper
 * Monitors live API documentation for new endpoints and updates
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

interface LiveEndpoint {
    name: string;
    method: string;
    url: string;
    description: string;
    parameters: Array<{
        name: string;
        type: string;
        description: string;
        required: boolean;
    }>;
    exampleResponse: string;
}

export class FootyStatsDocumentationScraper {
    private readonly DOCS_URL = 'https://footystats.org/api/documentations/';
    private readonly API_MD_PATH: string;
    private readonly FOOTY_YAML_PATH: string;

    constructor(basePath: string) {
        this.API_MD_PATH = path.join(basePath, 'api.md');
        this.FOOTY_YAML_PATH = path.join(basePath, 'footy.yaml');
    }

    /**
     * Scrape live documentation and compare with existing specs
     */
    async scrapeAndCompare(): Promise<{
        newEndpoints: LiveEndpoint[];
        missingFromSpec: LiveEndpoint[];
        currentEndpoints: LiveEndpoint[];
    }> {
        console.log('🔍 Scraping live FootyStats API documentation...');

        try {
            // Scrape live documentation
            const liveEndpoints = await this.scrapeLiveDocumentation();

            // Parse existing api.md file
            const apiMdEndpoints = await this.parseApiMdFile();

            // Parse footy.yaml spec
            const specEndpoints = await this.parseFootyYaml();

            // Compare and find differences
            const comparison = this.compareEndpoints(liveEndpoints, specEndpoints, apiMdEndpoints);

            console.log(`📊 Found ${liveEndpoints.length} endpoints in live documentation`);
            console.log(`📋 Found ${specEndpoints.length} endpoints in footy.yaml`);
            console.log(`📄 Found ${apiMdEndpoints.length} endpoints in api.md`);

            if (comparison.newEndpoints.length > 0) {
                console.log(`🆕 Found ${comparison.newEndpoints.length} new endpoints!`);
                await this.updateSpecifications(comparison.newEndpoints);
            }

            return comparison;

        } catch (error) {
            console.error('❌ Failed to scrape documentation:', error);
            throw error;
        }
    }

    private async scrapeLiveDocumentation(): Promise<LiveEndpoint[]> {
        try {
            const response = await axios.get(this.DOCS_URL, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'FootyStats MCP Server/1.0.0'
                }
            });

            const $ = cheerio.load(response.data);
            const endpoints: LiveEndpoint[] = [];

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

        } catch (error) {
            console.warn('⚠️ Failed to scrape live documentation, using fallback methods');
            return this.getFallbackEndpoints();
        }
    } private parseEndpointFromHtml($: cheerio.CheerioAPI, element: any): LiveEndpoint | null {
        const $element = $(element);

        // Extract endpoint information from various HTML patterns
        const name = $element.find('h2, h3, .endpoint-title').first().text().trim();
        const method = this.extractMethod($element.text());
        const url = this.extractUrl($element.text());
        const description = $element.find('p, .description').first().text().trim();

        if (!name || !url) return null;

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

    private parseWithFallbackPatterns($: cheerio.CheerioAPI): LiveEndpoint[] {
        const endpoints: LiveEndpoint[] = [];

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

    private parseEndpointFromText(text: string): LiveEndpoint | null {
        // Extract endpoint info from text using regex patterns
        const methodMatch = text.match(/(GET|POST|PUT|DELETE|PATCH)/i);
        const urlMatch = text.match(/https?:\/\/[^\s]+/);

        if (!methodMatch || !urlMatch) return null;

        return {
            name: text.split('\n')[0]?.trim() || 'Unknown Endpoint',
            method: methodMatch[1].toUpperCase(),
            url: urlMatch[0],
            description: text.trim(),
            parameters: [],
            exampleResponse: ''
        };
    }

    private extractMethod(text: string): string {
        const match = text.match(/(GET|POST|PUT|DELETE|PATCH)/i);
        return match ? match[1].toUpperCase() : 'GET';
    }

    private extractUrl(text: string): string {
        const match = text.match(/https?:\/\/[^\s]+/);
        return match ? match[0] : '';
    }

    private extractParameters($element: cheerio.Cheerio<cheerio.Element>): Array<{ name: string; type: string; description: string; required: boolean }> {
        const parameters: Array<{ name: string; type: string; description: string; required: boolean }> = [];

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

    private extractExampleResponse($element: cheerio.Cheerio<cheerio.Element>): string {
        const codeBlocks = $element.find('pre, code, .example-response');
        return codeBlocks.first().text().trim();
    }

    private async parseApiMdFile(): Promise<LiveEndpoint[]> {
        try {
            const content = fs.readFileSync(this.API_MD_PATH, 'utf-8');
            return this.parseApiMdContent(content);
        } catch (error) {
            console.warn('⚠️ Could not read api.md file');
            return [];
        }
    }

    private parseApiMdContent(content: string): LiveEndpoint[] {
        const endpoints: LiveEndpoint[] = [];
        const sections = content.split(/#{1,3}\s+/);

        sections.forEach(section => {
            const lines = section.split('\n');
            const title = lines[0]?.trim();

            if (!title) return;

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

    private extractParametersFromMd(section: string): Array<{ name: string; type: string; description: string; required: boolean }> {
        const parameters: Array<{ name: string; type: string; description: string; required: boolean }> = [];
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

    private extractResponseFromMd(section: string): string {
        const responseMatch = section.match(/```[\s\S]*?```/);
        return responseMatch ? responseMatch[0] : '';
    }

    private async parseFootyYaml(): Promise<LiveEndpoint[]> {
        try {
            const content = fs.readFileSync(this.FOOTY_YAML_PATH, 'utf-8');
            const yaml = require('yaml');
            const spec = yaml.parse(content);

            const endpoints: LiveEndpoint[] = [];
            const paths = spec.paths || {};

            for (const [path, methods] of Object.entries(paths)) {
                for (const [method, details] of Object.entries(methods as any)) {
                    if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
                        endpoints.push({
                            name: details.operationId || `${method} ${path}`,
                            method: method.toUpperCase(),
                            url: `${spec.servers?.[0]?.url || ''}${path}`,
                            description: details.description || details.summary || '',
                            parameters: (details.parameters || []).map((param: any) => ({
                                name: param.name,
                                type: param.schema?.type || 'string',
                                description: param.description || '',
                                required: param.required || false
                            })),
                            exampleResponse: ''
                        });
                    }
                }
            }

            return endpoints;
        } catch (error) {
            console.warn('⚠️ Could not read footy.yaml file');
            return [];
        }
    }

    private compareEndpoints(
        liveEndpoints: LiveEndpoint[],
        specEndpoints: LiveEndpoint[],
        apiMdEndpoints: LiveEndpoint[]
    ) {
        const specUrls = new Set(specEndpoints.map(e => this.normalizeUrl(e.url)));
        const apiMdUrls = new Set(apiMdEndpoints.map(e => this.normalizeUrl(e.url)));

        const newEndpoints = liveEndpoints.filter(endpoint =>
            !specUrls.has(this.normalizeUrl(endpoint.url)) &&
            !apiMdUrls.has(this.normalizeUrl(endpoint.url))
        );

        const missingFromSpec = liveEndpoints.filter(endpoint =>
            !specUrls.has(this.normalizeUrl(endpoint.url))
        );

        return {
            newEndpoints,
            missingFromSpec,
            currentEndpoints: liveEndpoints
        };
    }

    private normalizeUrl(url: string): string {
        return url.replace(/^https?:\/\/[^\/]+/, '').replace(/\?.*$/, '');
    }

    private async updateSpecifications(newEndpoints: LiveEndpoint[]) {
        console.log('📝 Updating specifications with new endpoints...');

        // Update footy.yaml
        await this.updateFootyYaml(newEndpoints);

        // Update api.md
        await this.updateApiMd(newEndpoints);

        console.log('✅ Specifications updated successfully');
    }

    private async updateFootyYaml(newEndpoints: LiveEndpoint[]) {
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

        } catch (error) {
            console.error('❌ Failed to update footy.yaml:', error);
        }
    }

    private async updateApiMd(newEndpoints: LiveEndpoint[]) {
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

        } catch (error) {
            console.error('❌ Failed to update api.md:', error);
        }
    }

    private generateOperationId(name: string): string {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    private convertParametersToOpenAPI(parameters: Array<{ name: string; type: string; description: string; required: boolean }>) {
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

    private getFallbackEndpoints(): LiveEndpoint[] {
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
