# MCP Backend Development Server

A comprehensive Model Context Protocol (MCP) server designed to assist with backend development tasks. This server integrates seamlessly with GitHub Copilot coding agent to provide advanced backend development capabilities.

## 🚀 Features

The MCP server provides 9 comprehensive tools for backend development:

### 🔧 Core Development Tools

1. **`create_api_endpoint`** - Generate complete API endpoints with:
   - Express.js route handlers
   - Input validation and sanitization
   - Middleware integration (auth, rate limiting, etc.)
   - Comprehensive test suites
   - OpenAPI documentation

2. **`create_database_schema`** - Design and generate database schemas:
   - Support for multiple ORMs (Prisma, Sequelize, TypeORM, Mongoose)
   - Automatic migration generation
   - Relationship management
   - Model/Entity code generation

3. **`generate_tests`** - Create comprehensive test suites:
   - Unit, integration, E2E, performance, and security tests
   - Support for Jest, Mocha, and Vitest
   - Mock implementations
   - Coverage configuration

### 🔒 Security & Quality Tools

4. **`setup_security`** - Implement security best practices:
   - Authentication systems (JWT, OAuth, session, API key)
   - Security middleware (Helmet, CORS, rate limiting)
   - Input validation and sanitization
   - XSS and SQL injection protection

5. **`analyze_code_quality`** - Comprehensive code analysis:
   - Security vulnerability detection
   - Performance issue identification
   - Code complexity analysis
   - Maintainability recommendations

### ⚡ Performance & Deployment Tools

6. **`optimize_performance`** - Performance optimization:
   - Database query optimization
   - Caching strategies (Redis, in-memory)
   - API response optimization
   - Memory and CPU optimization

7. **`setup_deployment`** - DevOps and deployment configuration:
   - Docker containerization
   - Kubernetes manifests
   - CI/CD pipelines (GitHub Actions, GitLab CI)
   - Cloud deployment (AWS, GCP, Azure)

8. **`create_documentation`** - Generate comprehensive documentation:
   - API documentation (OpenAPI/Swagger)
   - README files
   - Architecture documentation
   - Deployment guides

9. **`analyze_dependencies`** - Dependency management:
   - Vulnerability scanning
   - Outdated package detection
   - Unused dependency identification
   - License compliance checking

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. **Install dependencies:**
   ```bash
   cd mcp-backend-server
   npm install
   ```

2. **Build the server:**
   ```bash
   npm run build
   ```

3. **Test the server:**
   ```bash
   npm run dev
   ```

## 🤖 GitHub Copilot Integration

This MCP server is designed to work with GitHub Copilot coding agent. Follow these steps to integrate:

### Step 1: Repository Configuration

1. Navigate to your repository settings on GitHub
2. Go to **Settings** → **Copilot** → **Copilot agent**
3. Add the following MCP configuration:

```json
{
  "mcpServers": {
    "backend-development-server": {
      "command": "node",
      "args": ["mcp-backend-server/dist/index.js"],
      "type": "local",
      "tools": [
        "create_api_endpoint",
        "create_database_schema", 
        "generate_tests",
        "analyze_code_quality",
        "setup_security",
        "optimize_performance",
        "create_documentation",
        "setup_deployment",
        "analyze_dependencies"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Step 2: Environment Setup (Optional)

If your MCP server requires environment variables or secrets:

1. Create a `copilot` environment in your repository
2. Add secrets with the `COPILOT_MCP_` prefix
3. Reference them in the MCP configuration:

```json
{
  "mcpServers": {
    "backend-development-server": {
      "command": "node",
      "args": ["mcp-backend-server/dist/index.js"],
      "tools": ["*"],
      "env": {
        "API_KEY": "COPILOT_MCP_API_KEY",
        "DATABASE_URL": "COPILOT_MCP_DATABASE_URL"
      }
    }
  }
}
```

### Step 3: Validation

1. Create an issue in your repository
2. Assign it to @github-copilot[bot]
3. Copilot will create a pull request
4. Check the logs to verify MCP server integration

## 📖 Usage Examples

Once integrated with GitHub Copilot, you can use natural language to request backend development tasks:

### API Development
- "Create a REST API endpoint for user management with authentication"
- "Generate CRUD endpoints for a blog post system"
- "Add rate limiting and validation to the existing API"

### Database Design
- "Design a database schema for an e-commerce system"
- "Create Prisma models for user authentication"
- "Generate migrations for the user profile updates"

### Testing
- "Generate comprehensive tests for the user service"
- "Create integration tests for the payment API"
- "Add performance tests for the search endpoint"

### Security
- "Implement JWT authentication with refresh tokens"
- "Add security middleware for XSS protection"
- "Audit the codebase for security vulnerabilities"

### Performance
- "Optimize database queries in the user service"
- "Implement Redis caching for frequently accessed data"
- "Analyze and optimize API response times"

### Deployment
- "Create Docker configuration for production deployment"
- "Set up Kubernetes manifests for the application"
- "Generate CI/CD pipeline for automated deployment"

## 🏗️ Architecture

The MCP server is built with:

- **TypeScript** for type safety
- **Zod** for schema validation  
- **Model Context Protocol SDK** for MCP integration
- **Modular design** for easy extension

### Server Structure

```
src/
├── index.ts           # Main MCP server implementation
├── schemas/           # Zod validation schemas
├── generators/        # Code generation utilities
└── analyzers/         # Code analysis tools
```

## 🔧 Development

### Adding New Tools

To add a new MCP tool:

1. Define the tool schema using Zod
2. Add the tool to the `ListToolsRequestSchema` handler
3. Implement the tool handler in `CallToolRequestSchema`
4. Add helper methods for code generation

### Testing

```bash
# Run tests
npm test

# Run in development mode
npm run dev

# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-tool`
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review the [MCP Documentation](https://modelcontextprotocol.io/)
3. Check [GitHub Copilot MCP Integration Guide](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-coding-agent-with-mcp)

---

**Note**: This MCP server is designed specifically for GitHub Copilot coding agent integration. It follows all security best practices and provides read-only analysis tools by default.
