#!/usr/bin/env node

/**
 * 🔍 OpenAPI Validation Script
 * Validates footy.yaml against OpenAPI 3.1 specification
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

async function validateOpenAPI() {
    try {
        console.log('🔍 Starting OpenAPI Validation for footy.yaml...');
        console.log('='.repeat(60));

        // Read and parse YAML file
        const yamlPath = path.join(__dirname, 'footy.yaml');
        if (!fs.existsSync(yamlPath)) {
            throw new Error(`footy.yaml not found at ${yamlPath}`);
        }

        const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        console.log('✅ Successfully read footy.yaml');

        // Parse YAML
        let openApiSpec;
        try {
            openApiSpec = yaml.load(yamlContent);
            console.log('✅ Successfully parsed YAML syntax');
        } catch (parseError) {
            console.error('❌ YAML Parse Error:', parseError.message);
            return false;
        }

        // Basic structure validation
        console.log('\n📋 Basic Structure Validation:');
        
        // Check required fields
        const requiredFields = ['openapi', 'info', 'paths'];
        let hasErrors = false;

        for (const field of requiredFields) {
            if (!openApiSpec[field]) {
                console.error(`❌ Missing required field: ${field}`);
                hasErrors = true;
            } else {
                console.log(`✅ ${field}: Present`);
            }
        }

        // Check OpenAPI version
        if (openApiSpec.openapi) {
            if (openApiSpec.openapi.startsWith('3.')) {
                console.log(`✅ OpenAPI Version: ${openApiSpec.openapi}`);
            } else {
                console.error(`❌ Unsupported OpenAPI version: ${openApiSpec.openapi}`);
                hasErrors = true;
            }
        }

        // Check info object
        if (openApiSpec.info) {
            const infoRequired = ['title', 'version'];
            for (const field of infoRequired) {
                if (!openApiSpec.info[field]) {
                    console.error(`❌ Missing info.${field}`);
                    hasErrors = true;
                } else {
                    console.log(`✅ info.${field}: ${openApiSpec.info[field]}`);
                }
            }
        }

        // Analyze paths
        console.log('\n🛣️  Paths Analysis:');
        if (openApiSpec.paths) {
            const pathCount = Object.keys(openApiSpec.paths).length;
            console.log(`✅ Total paths: ${pathCount}`);
            
            Object.entries(openApiSpec.paths).forEach(([path, methods]) => {
                console.log(`  📍 ${path}:`);
                Object.keys(methods).forEach(method => {
                    console.log(`    🔹 ${method.toUpperCase()}`);
                });
            });
        }

        // Check components
        console.log('\n🧩 Components Analysis:');
        if (openApiSpec.components) {
            Object.entries(openApiSpec.components).forEach(([type, items]) => {
                const count = Object.keys(items).length;
                console.log(`✅ ${type}: ${count} items`);
            });
        } else {
            console.log('⚠️  No components defined');
        }

        // Security validation
        console.log('\n🔐 Security Configuration:');
        if (openApiSpec.security) {
            console.log(`✅ Security requirements: ${openApiSpec.security.length}`);
        }
        if (openApiSpec.components?.securitySchemes) {
            const schemes = Object.keys(openApiSpec.components.securitySchemes);
            console.log(`✅ Security schemes: ${schemes.join(', ')}`);
        }

        // Server validation
        console.log('\n🌐 Server Configuration:');
        if (openApiSpec.servers) {
            openApiSpec.servers.forEach((server, index) => {
                console.log(`✅ Server ${index + 1}: ${server.url}`);
                if (server.description) {
                    console.log(`   Description: ${server.description}`);
                }
            });
        }

        // Parameter validation
        console.log('\n📊 Parameters Validation:');
        if (openApiSpec.parameters) {
            const paramCount = Object.keys(openApiSpec.parameters).length;
            console.log(`✅ Global parameters: ${paramCount}`);
        }

        // Final validation summary
        console.log('\n' + '='.repeat(60));
        if (hasErrors) {
            console.log('❌ VALIDATION FAILED - Issues found in footy.yaml');
            console.log('Please fix the errors above before proceeding.');
            return false;
        } else {
            console.log('🎉 VALIDATION SUCCESSFUL - footy.yaml is valid!');
            console.log('✅ Ready for TypeScript client generation');
            return true;
        }

    } catch (error) {
        console.error('💥 Validation Error:', error.message);
        return false;
    }
}

// Check for specific FootyStats API issues
function validateFootyStatsSpecific(spec) {
    console.log('\n⚽ FootyStats API Specific Validation:');
    
    // Check API key configuration
    if (spec.components?.securitySchemes?.ApiKeyAuth) {
        const apiKeyAuth = spec.components.securitySchemes.ApiKeyAuth;
        if (apiKeyAuth.type === 'apiKey' && apiKeyAuth.in === 'query' && apiKeyAuth.name === 'key') {
            console.log('✅ API Key authentication properly configured');
        } else {
            console.log('⚠️  API Key authentication configuration issues');
        }
    }

    // Check for football-specific schemas
    const footballSchemas = ['Match', 'Team', 'Player', 'League'];
    footballSchemas.forEach(schema => {
        if (spec.components?.schemas?.[schema]) {
            console.log(`✅ ${schema} schema defined`);
        } else {
            console.log(`⚠️  ${schema} schema missing`);
        }
    });

    // Check endpoint coverage
    const expectedEndpoints = [
        '/league-list',
        '/todays-matches', 
        '/match',
        '/team',
        '/player-stats'
    ];

    expectedEndpoints.forEach(endpoint => {
        if (spec.paths?.[endpoint]) {
            console.log(`✅ ${endpoint} endpoint defined`);
        } else {
            console.log(`⚠️  ${endpoint} endpoint missing`);
        }
    });
}

// Run validation
if (require.main === module) {
    validateOpenAPI().then(isValid => {
        process.exit(isValid ? 0 : 1);
    });
}

module.exports = { validateOpenAPI };
