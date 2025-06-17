import { BackendMCPServer } from '../src/index';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

describe('MCP Backend Development Server', () => {
    let server: BackendMCPServer;

    beforeEach(() => {
        server = new BackendMCPServer();
    });

    describe('Tool: create_api_endpoint', () => {
        it('should generate a complete API endpoint', async () => {
            const result = await server['createApiEndpoint']({
                endpoint: '/api/users',
                method: 'GET',
                description: 'Get all users',
                validation: true,
                authentication: false,
                rateLimit: false
            });

            expect(result.content).toBeDefined();
            expect(result.content[0].text).toContain('router.get(\'/api/users\'');
            expect(result.content[0].text).toContain('validateRequest');
        });

        it('should include authentication when requested', async () => {
            const result = await server['createApiEndpoint']({
                endpoint: '/api/admin',
                method: 'POST',
                description: 'Admin endpoint',
                authentication: true,
                rateLimit: true
            });

            expect(result.content[0].text).toContain('authenticateToken');
            expect(result.content[0].text).toContain('rateLimit');
        });
    });

    describe('Tool: create_database_schema', () => {
        it('should generate Prisma schema', async () => {
            const result = await server['createDatabaseSchema']({
                tableName: 'User',
                fields: [
                    { name: 'email', type: 'string', required: true, unique: true, index: false },
                    { name: 'name', type: 'string', required: true, unique: false, index: false },
                    { name: 'age', type: 'number', required: false, unique: false, index: false }
                ],
                relationships: [],
                orm: 'prisma'
            });

            expect(result.content[0].text).toContain('model User');
            expect(result.content[0].text).toContain('email String @unique');
            expect(result.content[0].text).toContain('name String');
            expect(result.content[0].text).toContain('age Int?');
        });

        it('should include relationships', async () => {
            const result = await server['createDatabaseSchema']({
                tableName: 'Post',
                fields: [
                    { name: 'title', type: 'string', required: true, unique: false, index: false }
                ],
                relationships: [
                    { type: 'many-to-one', table: 'User', field: 'authorId' }
                ],
                orm: 'prisma'
            });

            expect(result.content[0].text).toContain('user User @relation');
            expect(result.content[0].text).toContain('authorId String');
        });
    });

    describe('Tool: generate_tests', () => {
        it('should generate unit tests', async () => {
            const result = await server['generateTests']({
                testType: 'unit',
                targetFile: 'src/services/userService.ts',
                framework: 'jest',
                coverage: true,
                mocking: true
            });

            expect(result.content[0].text).toContain('describe');
            expect(result.content[0].text).toContain('jest.clearAllMocks');
            expect(result.content[0].text).toContain('userService');
        });

        it('should generate integration tests', async () => {
            const result = await server['generateTests']({
                testType: 'integration',
                targetFile: 'src/controllers/userController.ts',
                framework: 'jest'
            });

            expect(result.content[0].text).toContain('Integration tests');
            expect(result.content[0].text).toContain('integrate with external services');
        });
    });

    describe('Tool: analyze_code_quality', () => {
        it('should analyze code quality', async () => {
            const result = await server['analyzeCodeQuality']({
                directory: './src',
                includePatterns: ['**/*.ts'],
                excludePatterns: ['node_modules/**'],
                checks: ['security', 'performance']
            });

            expect(result.content[0].text).toContain('Code Quality Analysis');
            expect(result.content[0].text).toContain('Files analyzed');
            expect(result.content[0].text).toContain('Issues Found');
            expect(result.content[0].text).toContain('Recommendations');
        });
    });

    describe('Tool: setup_security', () => {
        it('should generate JWT security setup', async () => {
            const result = await server['setupSecurity']({
                authType: 'jwt',
                features: ['rate-limiting', 'helmet', 'cors'],
                framework: 'express'
            });

            expect(result.content[0].text).toContain('jwt.verify');
            expect(result.content[0].text).toContain('helmet');
            expect(result.content[0].text).toContain('cors');
            expect(result.content[0].text).toContain('rateLimit');
        });
    });

    describe('Tool: optimize_performance', () => {
        it('should generate performance optimizations', async () => {
            const result = await server['optimizePerformance']({
                area: 'database',
                currentMetrics: '{"avgQueryTime": 500}',
                targetImprovement: '50% faster queries'
            });

            expect(result.content[0].text).toContain('Performance Optimization');
            expect(result.content[0].text).toContain('Database Query Optimization');
            expect(result.content[0].text).toContain('Caching Implementation');
        });
    });

    describe('Tool: create_documentation', () => {
        it('should generate API documentation', async () => {
            const result = await server['createDocumentation']({
                type: 'api',
                format: 'markdown',
                includeExamples: true
            });

            expect(result.content[0].text).toContain('# API Documentation');
            expect(result.content[0].text).toContain('## Authentication');
            expect(result.content[0].text).toContain('## Endpoints');
            expect(result.content[0].text).toContain('curl -H');
        });

        it('should generate README documentation', async () => {
            const result = await server['createDocumentation']({
                type: 'readme',
                format: 'markdown',
                includeExamples: true
            });

            expect(result.content[0].text).toContain('# Project Name');
            expect(result.content[0].text).toContain('## 🚀 Features');
            expect(result.content[0].text).toContain('## ⚙️ Installation');
        });
    });

    describe('Tool: setup_deployment', () => {
        it('should generate Docker deployment config', async () => {
            const result = await server['setupDeployment']({
                platform: 'docker',
                environment: 'production',
                features: ['ci-cd', 'monitoring']
            });

            expect(result.content[0].text).toContain('FROM node:18-alpine');
            expect(result.content[0].text).toContain('docker-compose.yml');
            expect(result.content[0].text).toContain('postgres');
        });

        it('should generate Kubernetes deployment config', async () => {
            const result = await server['setupDeployment']({
                platform: 'kubernetes',
                environment: 'production',
                features: ['scaling', 'monitoring']
            });

            expect(result.content[0].text).toContain('apiVersion: apps/v1');
            expect(result.content[0].text).toContain('kind: Deployment');
            expect(result.content[0].text).toContain('replicas: 3');
        });
    });

    describe('Tool: analyze_dependencies', () => {
        it('should analyze package.json dependencies', async () => {
            // Mock fs.readJson to return a sample package.json
            const mockPackageJson = {
                dependencies: {
                    'express': '4.17.1',
                    'lodash': '4.17.15'
                },
                devDependencies: {
                    'jest': '29.0.0'
                }
            };

            // Mock the file system call
            jest.spyOn(require('fs-extra'), 'readJson').mockResolvedValue(mockPackageJson);

            const result = await server['analyzeDependencies']({
                packageFile: 'package.json',
                checks: ['vulnerabilities', 'outdated']
            });

            expect(result.content[0].text).toContain('Dependency Analysis');
            expect(result.content[0].text).toContain('Total dependencies');
            expect(result.content[0].text).toContain('Vulnerabilities found');
            expect(result.content[0].text).toContain('Update Commands');
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid tool names', async () => {
            const request = {
                params: {
                    name: 'invalid_tool',
                    arguments: {}
                }
            };

            await expect(
                server['server']['requestHandlers'].get(CallToolRequestSchema.name)(request)
            ).rejects.toThrow('Unknown tool: invalid_tool');
        });

        it('should handle invalid parameters', async () => {
            const request = {
                params: {
                    name: 'create_api_endpoint',
                    arguments: {
                        // Missing required fields
                        invalidField: 'value'
                    }
                }
            };

            await expect(
                server['server']['requestHandlers'].get(CallToolRequestSchema.name)(request)
            ).rejects.toThrow('Invalid parameters');
        });
    });
});
