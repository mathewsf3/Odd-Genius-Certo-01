"use strict";
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
const index_1 = require("../src/index");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
describe('MCP Backend Development Server', () => {
    let server;
    beforeEach(() => {
        server = new index_1.BackendMCPServer();
    });
    describe('Tool: create_api_endpoint', () => {
        it('should generate a complete API endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['createApiEndpoint']({
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
        }));
        it('should include authentication when requested', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['createApiEndpoint']({
                endpoint: '/api/admin',
                method: 'POST',
                description: 'Admin endpoint',
                authentication: true,
                rateLimit: true
            });
            expect(result.content[0].text).toContain('authenticateToken');
            expect(result.content[0].text).toContain('rateLimit');
        }));
    });
    describe('Tool: create_database_schema', () => {
        it('should generate Prisma schema', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['createDatabaseSchema']({
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
        }));
        it('should include relationships', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['createDatabaseSchema']({
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
        }));
    });
    describe('Tool: generate_tests', () => {
        it('should generate unit tests', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['generateTests']({
                testType: 'unit',
                targetFile: 'src/services/userService.ts',
                framework: 'jest',
                coverage: true,
                mocking: true
            });
            expect(result.content[0].text).toContain('describe');
            expect(result.content[0].text).toContain('jest.clearAllMocks');
            expect(result.content[0].text).toContain('userService');
        }));
        it('should generate integration tests', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['generateTests']({
                testType: 'integration',
                targetFile: 'src/controllers/userController.ts',
                framework: 'jest'
            });
            expect(result.content[0].text).toContain('Integration tests');
            expect(result.content[0].text).toContain('integrate with external services');
        }));
    });
    describe('Tool: analyze_code_quality', () => {
        it('should analyze code quality', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['analyzeCodeQuality']({
                directory: './src',
                includePatterns: ['**/*.ts'],
                excludePatterns: ['node_modules/**'],
                checks: ['security', 'performance']
            });
            expect(result.content[0].text).toContain('Code Quality Analysis');
            expect(result.content[0].text).toContain('Files analyzed');
            expect(result.content[0].text).toContain('Issues Found');
            expect(result.content[0].text).toContain('Recommendations');
        }));
    });
    describe('Tool: setup_security', () => {
        it('should generate JWT security setup', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['setupSecurity']({
                authType: 'jwt',
                features: ['rate-limiting', 'helmet', 'cors'],
                framework: 'express'
            });
            expect(result.content[0].text).toContain('jwt.verify');
            expect(result.content[0].text).toContain('helmet');
            expect(result.content[0].text).toContain('cors');
            expect(result.content[0].text).toContain('rateLimit');
        }));
    });
    describe('Tool: optimize_performance', () => {
        it('should generate performance optimizations', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['optimizePerformance']({
                area: 'database',
                currentMetrics: '{"avgQueryTime": 500}',
                targetImprovement: '50% faster queries'
            });
            expect(result.content[0].text).toContain('Performance Optimization');
            expect(result.content[0].text).toContain('Database Query Optimization');
            expect(result.content[0].text).toContain('Caching Implementation');
        }));
    });
    describe('Tool: create_documentation', () => {
        it('should generate API documentation', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['createDocumentation']({
                type: 'api',
                format: 'markdown',
                includeExamples: true
            });
            expect(result.content[0].text).toContain('# API Documentation');
            expect(result.content[0].text).toContain('## Authentication');
            expect(result.content[0].text).toContain('## Endpoints');
            expect(result.content[0].text).toContain('curl -H');
        }));
        it('should generate README documentation', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['createDocumentation']({
                type: 'readme',
                format: 'markdown',
                includeExamples: true
            });
            expect(result.content[0].text).toContain('# Project Name');
            expect(result.content[0].text).toContain('## 🚀 Features');
            expect(result.content[0].text).toContain('## ⚙️ Installation');
        }));
    });
    describe('Tool: setup_deployment', () => {
        it('should generate Docker deployment config', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['setupDeployment']({
                platform: 'docker',
                environment: 'production',
                features: ['ci-cd', 'monitoring']
            });
            expect(result.content[0].text).toContain('FROM node:18-alpine');
            expect(result.content[0].text).toContain('docker-compose.yml');
            expect(result.content[0].text).toContain('postgres');
        }));
        it('should generate Kubernetes deployment config', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['setupDeployment']({
                platform: 'kubernetes',
                environment: 'production',
                features: ['scaling', 'monitoring']
            });
            expect(result.content[0].text).toContain('apiVersion: apps/v1');
            expect(result.content[0].text).toContain('kind: Deployment');
            expect(result.content[0].text).toContain('replicas: 3');
        }));
    });
    describe('Tool: analyze_dependencies', () => {
        it('should analyze package.json dependencies', () => __awaiter(void 0, void 0, void 0, function* () {
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
            const result = yield server['analyzeDependencies']({
                packageFile: 'package.json',
                checks: ['vulnerabilities', 'outdated']
            });
            expect(result.content[0].text).toContain('Dependency Analysis');
            expect(result.content[0].text).toContain('Total dependencies');
            expect(result.content[0].text).toContain('Vulnerabilities found');
            expect(result.content[0].text).toContain('Update Commands');
        }));
    });
    describe('Error Handling', () => {
        it('should handle invalid tool names', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = {
                params: {
                    name: 'invalid_tool',
                    arguments: {}
                }
            };
            yield expect(server['server']['requestHandlers'].get(types_js_1.CallToolRequestSchema.name)(request)).rejects.toThrow('Unknown tool: invalid_tool');
        }));
        it('should handle invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = {
                params: {
                    name: 'create_api_endpoint',
                    arguments: {
                        // Missing required fields
                        invalidField: 'value'
                    }
                }
            };
            yield expect(server['server']['requestHandlers'].get(types_js_1.CallToolRequestSchema.name)(request)).rejects.toThrow('Invalid parameters');
        }));
    });
});
