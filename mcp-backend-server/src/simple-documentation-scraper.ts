/**
 * Simplified FootyStats API Documentation Scraper
 * Monitors live API documentation for new endpoints and updates
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';

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
        console.log('[INFO] Scraping live FootyStats API documentation...');

        try {
            // Scrape live documentation
            const liveEndpoints = await this.scrapeLiveDocumentation();

            // Parse existing api.md file
            const apiMdEndpoints = await this.parseApiMdFile();

            // Parse footy.yaml spec
            const specEndpoints = await this.parseFootyYamlFile();

            // Compare and find differences
            const comparison = this.compareEndpoints(liveEndpoints, specEndpoints, apiMdEndpoints);

            // Update specifications if new endpoints found
            if (comparison.newEndpoints.length > 0) {
                console.log('[UPDATE] Found ' + comparison.newEndpoints.length + ' new endpoints, updating specifications...');
                await this.updateSpecifications(comparison.newEndpoints);
            }

            return comparison;
        } catch (error) {
            console.error('[ERROR] Error during documentation scraping:', error);
            return {
                newEndpoints: [],
                missingFromSpec: [],
                currentEndpoints: this.getFallbackEndpoints()
            };
        }
    }

    /**
     * Scrape live API documentation from FootyStats
     */
    private async scrapeLiveDocumentation(): Promise<LiveEndpoint[]> {
        try {
            const response = await axios.get(this.DOCS_URL, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            // Simple HTML parsing to extract endpoint information
            const html = response.data;
            const endpoints: LiveEndpoint[] = [];

            // Extract endpoints using regex patterns (simplified approach)
            const endpointPattern = /<div[^>]*class="endpoint"[^>]*>(.*?)<\/div>/gs;
            const matches = html.match(endpointPattern) || [];

            matches.forEach((match: string) => {
                try {
                    const endpoint = this.parseEndpointFromHtml(match);
                    if (endpoint) {
                        endpoints.push(endpoint);
                    }
                } catch (parseError) {
                    console.warn('[WARN] Failed to parse endpoint:', parseError);
                }
            });

            console.log('[SUCCESS] Scraped ' + endpoints.length + ' endpoints from live documentation');
            return endpoints.length > 0 ? endpoints : this.getFallbackEndpoints();
        } catch (error) {
            console.warn('[WARN] Could not scrape live documentation, using fallback endpoints');
            return this.getFallbackEndpoints();
        }
    }

    /**
     * Parse endpoint information from HTML
     */
    private parseEndpointFromHtml(html: string): LiveEndpoint | null {
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
        } catch (error) {
            return null;
        }
    }

    /**
     * Parse existing api.md file
     */
    private async parseApiMdFile(): Promise<LiveEndpoint[]> {
        try {
            if (!fs.existsSync(this.API_MD_PATH)) {
                return [];
            }

            const content = fs.readFileSync(this.API_MD_PATH, 'utf-8');
            const endpoints: LiveEndpoint[] = [];

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
        } catch (error) {
            console.warn('[WARN] Could not read api.md file:', (error as Error).message);
            return [];
        }
    }

    /**
     * Parse existing footy.yaml specification
     */
    private async parseFootyYamlFile(): Promise<LiveEndpoint[]> {
        try {
            if (!fs.existsSync(this.FOOTY_YAML_PATH)) {
                return [];
            }

            const content = fs.readFileSync(this.FOOTY_YAML_PATH, 'utf-8');
            const spec = YAML.parse(content);
            const endpoints: LiveEndpoint[] = [];

            if (spec.paths) {
                Object.entries(spec.paths).forEach(([path, pathItem]: [string, any]) => {
                    Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
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
        } catch (error) {
            console.warn('[WARN] Could not read footy.yaml file:', (error as Error).message);
            return [];
        }
    }

    /**
     * Compare endpoints and find differences
     */
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

    /**
     * Normalize URL for comparison
     */
    private normalizeUrl(url: string): string {
        return url.replace(/^https?:\/\/[^\/]+/, '').replace(/\/$/, '').toLowerCase();
    }

    /**
     * Update both footy.yaml and api.md with new endpoints
     */
    private async updateSpecifications(newEndpoints: LiveEndpoint[]) {
        await this.updateFootyYaml(newEndpoints);
        await this.updateApiMd(newEndpoints);
    }

    /**
     * Update footy.yaml with new endpoints
     */
    private async updateFootyYaml(newEndpoints: LiveEndpoint[]) {
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
        } catch (error) {
            console.error('[ERROR] Failed to update footy.yaml:', error);
        }
    }

    /**
     * Update api.md with new endpoints
     */
    private async updateApiMd(newEndpoints: LiveEndpoint[]) {
        try {
            let content = fs.readFileSync(this.API_MD_PATH, 'utf-8');

            newEndpoints.forEach(endpoint => {
                const endpointDoc = `
## ${endpoint.name}

### ${endpoint.method}
URL: \`${endpoint.url}\`

**Description:** ${endpoint.description}

**Parameters:**
${endpoint.parameters.map(param => 
    `- **${param.name}** (${param.type}${param.required ? ', required' : ''}): ${param.description}`
).join('\n')}

---

`;
                content += endpointDoc;
            });

            fs.writeFileSync(this.API_MD_PATH, content);
            console.log('[SUCCESS] Updated api.md with ' + newEndpoints.length + ' new endpoints');
        } catch (error) {
            console.error('[ERROR] Failed to update api.md:', error);
        }
    }

    /**
     * Generate camelCase operationId from endpoint name
     */
    private generateOperationId(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
            .replace(/^(.)/, char => char.toLowerCase());
    }

    /**
     * Convert parameters to OpenAPI format
     */
    private convertParametersToOpenAPI(parameters: Array<{ name: string; type: string; description: string; required: boolean }>) {
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
    private getFallbackEndpoints(): LiveEndpoint[] {
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
