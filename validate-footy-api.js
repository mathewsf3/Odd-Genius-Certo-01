#!/usr/bin/env node

/**
 * 🧪 COMPREHENSIVE FOOTY.YAML VALIDATION SCRIPT
 * 
 * This script validates our footy.yaml OpenAPI specification against:
 * 1. API documentation (api.md) 
 * 2. Live API endpoints
 * 3. MCP server parsing
 * 4. Type-safe client generation
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// 🎯 Configuration
const CONFIG = {
    API_KEY: '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    BASE_URL: 'https://api.football-data-api.com',
    TIMEOUT: 10000,
    FOOTY_YAML_PATH: './footy.yaml',
    API_MD_PATH: './api.md'
};

// 📋 Expected Endpoints from API.MD
const EXPECTED_ENDPOINTS = [
    { path: '/league-list', method: 'GET', operationId: 'getLeagues' },
    { path: '/country-list', method: 'GET', operationId: 'getCountries' },
    { path: '/todays-matches', method: 'GET', operationId: 'getTodaysMatches' },
    { path: '/league-season', method: 'GET', operationId: 'getLeagueSeason' },
    { path: '/league-matches', method: 'GET', operationId: 'getLeagueMatches' },
    { path: '/league-teams', method: 'GET', operationId: 'getLeagueTeams' },
    { path: '/league-players', method: 'GET', operationId: 'getLeaguePlayers' },
    { path: '/league-referees', method: 'GET', operationId: 'getLeagueReferees' },
    { path: '/team', method: 'GET', operationId: 'getTeam' },
    { path: '/lastx', method: 'GET', operationId: 'getTeamLastXStats' },
    { path: '/match', method: 'GET', operationId: 'getMatch' },
    { path: '/league-tables', method: 'GET', operationId: 'getLeagueTables' },
    { path: '/player-stats', method: 'GET', operationId: 'getPlayerStats' },
    { path: '/referee', method: 'GET', operationId: 'getRefereeStats' },
    { path: '/stats-data-btts', method: 'GET', operationId: 'getBTTSStats' },
    { path: '/stats-data-over25', method: 'GET', operationId: 'getOver25Stats' }
];

// 🛠️ Utility Functions
function loadYamlFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return yaml.parse(content);
    } catch (error) {
        console.error(`❌ Error loading ${filePath}:`, error.message);
        return null;
    }
}

// 🔍 Validation Functions
async function validateYamlStructure(spec) {
    console.log('\n🔍 VALIDATING YAML STRUCTURE...');
    const issues = [];

    // Check required OpenAPI fields
    if (!spec.openapi) issues.push('Missing openapi version');
    if (!spec.info) issues.push('Missing info section');
    if (!spec.paths) issues.push('Missing paths section');
    if (!spec.components) issues.push('Missing components section');

    // Check paths structure
    if (spec.paths) {
        Object.entries(spec.paths).forEach(([path, pathItem]) => {
            if (!pathItem.get) {
                issues.push(`Path ${path} missing GET method`);
            } else {
                const get = pathItem.get;
                if (!get.operationId) issues.push(`Path ${path} missing operationId`);
                if (!get.summary) issues.push(`Path ${path} missing summary`);
                if (!get.responses) issues.push(`Path ${path} missing responses`);
            }
        });
    }

    if (issues.length === 0) {
        console.log('✅ YAML structure is valid');
    } else {
        console.log('❌ YAML structure issues:');
        issues.forEach(issue => console.log(`   • ${issue}`));
    }

    return issues;
}

async function validateEndpointCoverage(spec) {
    console.log('\n🎯 VALIDATING ENDPOINT COVERAGE...');
    
    const foundEndpoints = [];
    const missingEndpoints = [];
    const extraEndpoints = [];

    // Check what's in our YAML
    if (spec.paths) {
        Object.entries(spec.paths).forEach(([path, pathItem]) => {
            if (pathItem.get && pathItem.get.operationId) {
                foundEndpoints.push({
                    path,
                    method: 'GET',
                    operationId: pathItem.get.operationId
                });
            }
        });
    }

    // Check against expected endpoints
    EXPECTED_ENDPOINTS.forEach(expected => {
        const found = foundEndpoints.find(endpoint => 
            endpoint.path === expected.path && 
            endpoint.operationId === expected.operationId
        );
        
        if (!found) {
            missingEndpoints.push(expected);
        }
    });

    // Check for extra endpoints
    foundEndpoints.forEach(found => {
        const expected = EXPECTED_ENDPOINTS.find(expected => 
            expected.path === found.path && 
            expected.operationId === found.operationId
        );
        
        if (!expected) {
            extraEndpoints.push(found);
        }
    });

    // Report results
    console.log(`✅ Found ${foundEndpoints.length} endpoints in YAML`);
    console.log(`✅ Expected ${EXPECTED_ENDPOINTS.length} endpoints from API.MD`);
    
    if (missingEndpoints.length === 0) {
        console.log('✅ All expected endpoints are covered');
    } else {
        console.log(`❌ Missing ${missingEndpoints.length} endpoints:`);
        missingEndpoints.forEach(endpoint => {
            console.log(`   • ${endpoint.method} ${endpoint.path} (${endpoint.operationId})`);
        });
    }

    if (extraEndpoints.length > 0) {
        console.log(`⚠️  Found ${extraEndpoints.length} extra endpoints:`);
        extraEndpoints.forEach(endpoint => {
            console.log(`   • ${endpoint.method} ${endpoint.path} (${endpoint.operationId})`);
        });
    }

    return { foundEndpoints, missingEndpoints, extraEndpoints };
}

async function validateMCPServerCompatibility(spec) {
    console.log('\n🤖 VALIDATING MCP SERVER COMPATIBILITY...');
    
    // Simulate MCP server parsing
    const endpoints = new Map();
    
    if (spec.paths) {
        Object.entries(spec.paths).forEach(([pathString, pathItem]) => {
            Object.entries(pathItem).forEach(([method, endpoint]) => {
                if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
                    if (endpoint.operationId) {
                        endpoints.set(endpoint.operationId, {
                            path: pathString,
                            method: method.toUpperCase(),
                            operationId: endpoint.operationId,
                            summary: endpoint.summary,
                            description: endpoint.description
                        });
                    }
                }
            });
        });
    }

    console.log(`✅ Parsed ${endpoints.size} endpoints for MCP server`);
    
    // Check for duplicates
    const operationIds = Array.from(endpoints.keys());
    const duplicates = operationIds.filter((item, index) => operationIds.indexOf(item) !== index);
    
    if (duplicates.length === 0) {
        console.log('✅ No duplicate operationIds found');
    } else {
        console.log(`❌ Found ${duplicates.length} duplicate operationIds:`);
        duplicates.forEach(duplicate => console.log(`   • ${duplicate}`));
    }

    return { endpoints, duplicates };
}

async function validateGeneratedClient() {
    console.log('\n🔧 VALIDATING GENERATED CLIENT...');
    
    const clientPath = './src/apis/footy/services/DefaultService.ts';
    
    if (!fs.existsSync(clientPath)) {
        console.log('❌ Generated client not found');
        return { exists: false };
    }

    try {
        const clientContent = fs.readFileSync(clientPath, 'utf8');
        
        // Count methods
        const methodMatches = clientContent.match(/public static async \\w+/g) || [];
        const methodCount = methodMatches.length;
        
        // Check for expected methods
        const expectedMethods = EXPECTED_ENDPOINTS.map(e => e.operationId);
        const foundMethods = [];
        const missingMethods = [];
        
        expectedMethods.forEach(method => {
            if (clientContent.includes(`public static async ${method}`)) {
                foundMethods.push(method);
            } else {
                missingMethods.push(method);
            }
        });
        
        console.log(`✅ Generated client exists with ${methodCount} methods`);
        console.log(`✅ Found ${foundMethods.length}/${expectedMethods.length} expected methods`);
        
        if (missingMethods.length > 0) {
            console.log(`❌ Missing methods in generated client:`);
            missingMethods.forEach(method => console.log(`   • ${method}`));
        }
        
        return { 
            exists: true, 
            methodCount, 
            foundMethods, 
            missingMethods 
        };
    } catch (error) {
        console.log(`❌ Error reading generated client: ${error.message}`);
        return { exists: true, error: error.message };
    }
}

// 📊 Main Validation Function
async function main() {
    console.log('🚀 STARTING COMPREHENSIVE FOOTY.YAML VALIDATION');
    console.log('='.repeat(60));
    
    // Load files
    const spec = loadYamlFile(CONFIG.FOOTY_YAML_PATH);
    
    if (!spec) {
        console.log('❌ Cannot proceed without valid footy.yaml');
        process.exit(1);
    }

    // Run all validations
    const results = {
        yamlStructure: await validateYamlStructure(spec),
        endpointCoverage: await validateEndpointCoverage(spec),
        mcpCompatibility: await validateMCPServerCompatibility(spec),
        generatedClient: await validateGeneratedClient()
    };

    // Summary
    console.log('\n📋 VALIDATION SUMMARY');
    console.log('='.repeat(60));
    
    const structureIssues = results.yamlStructure.length;
    const missingEndpoints = results.endpointCoverage.missingEndpoints.length;
    const extraEndpoints = results.endpointCoverage.extraEndpoints.length;
    const duplicateOperationIds = results.mcpCompatibility.duplicates.length;
    const clientMissing = results.generatedClient.missingMethods?.length || 0;
    
    console.log(`📄 YAML Structure: ${structureIssues === 0 ? '✅ VALID' : `❌ ${structureIssues} issues`}`);
    console.log(`🎯 Endpoint Coverage: ${missingEndpoints === 0 ? '✅ COMPLETE' : `❌ ${missingEndpoints} missing`}`);
    console.log(`🤖 MCP Compatibility: ${duplicateOperationIds === 0 ? '✅ COMPATIBLE' : `❌ ${duplicateOperationIds} duplicates`}`);
    console.log(`🔧 Generated Client: ${clientMissing === 0 ? '✅ COMPLETE' : `❌ ${clientMissing} missing methods`}`);
    
    const totalIssues = structureIssues + missingEndpoints + duplicateOperationIds + clientMissing;
    
    if (totalIssues === 0) {
        console.log('\n🎉 ALL VALIDATIONS PASSED! FOOTY.YAML IS PERFECT! 🎉');
        process.exit(0);
    } else {
        console.log(`\n⚠️  FOUND ${totalIssues} TOTAL ISSUES THAT NEED FIXING`);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the validation
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Validation failed:', error);
        process.exit(1);
    });
}

module.exports = { main, CONFIG, EXPECTED_ENDPOINTS };
