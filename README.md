# Football Data API Backend

A comprehensive Node.js/TypeScript backend API for football data, built with Express and automatically generated from OpenAPI 3.1 specification.

## 🚀 Features

- **Complete Football Data API**: All endpoints from the Football Data API
- **Type-Safe**: Fully typed with TypeScript and auto-generated API client
- **OpenAPI 3.1**: Auto-generated from your `footy.yaml` specification
- **Express.js**: Fast, minimal web framework
- **Comprehensive Testing**: Unit, integration, and performance tests
- **Error Handling**: Robust error handling and logging
- **Security**: Helmet.js for security headers, CORS enabled
- **Development Tools**: Hot reload, debugging, and testing scripts

## 📁 Project Structure

```
src/
├── apis/footy/          # Auto-generated API client
├── middleware/          # Express middleware
├── routes/             # API route handlers
├── services/           # Business logic and API wrappers
├── tests/             # Comprehensive test suites
└── server.ts          # Main server file
```

## 🛠️ Setup & Installation

1. **Clone and Install**
   ```bash
   cd B-API
   pnpm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your API key if needed
   ```

3. **Start Development Server**
   ```bash
   pnpm run dev
   ```

   The server will start at `http://localhost:3000`

## 📚 API Endpoints

### Health Check
- `GET /health` - API health status

### Core Endpoints (All under `/api/v1`)

#### Countries & Leagues
- `GET /country-list` - Get all countries
- `GET /league-list` - Get all leagues
  - Query: `chosen_leagues_only`, `country`

#### Matches
- `GET /todays-matches` - Get today's matches
  - Query: `timezone`, `date`, `page`

#### League Data
- `GET /league-season` - Get league season data
  - Query: `season_id` (required), `max_time`
- `GET /league-matches` - Get league matches
  - Query: `season_id` (required), `page`, `max_per_page`, `max_time`
- `GET /league-teams` - Get league teams
  - Query: `season_id` (required), `page`, `include`, `max_time`
- `GET /league-players` - Get league players
  - Query: `season_id` (required), `include`
- `GET /league-referees` - Get league referees
  - Query: `season_id` (required)
- `GET /league-tables` - Get league tables
  - Query: `season_id` (required)

#### Teams & Players
- `GET /team` - Get team data
  - Query: `team_id` (required), `include`
- `GET /lastx` - Get team's last X stats
  - Query: `team_id` (required)
- `GET /player-stats` - Get player statistics
  - Query: `player_id` (required)
- `GET /referee` - Get referee statistics
  - Query: `referee_id` (required)

#### Match Details
- `GET /match` - Get match details
  - Query: `match_id` (required)

#### Statistics
- `GET /stats-data-btts` - Get BTTS (Both Teams To Score) stats
- `GET /stats-data-over25` - Get Over 2.5 goals stats

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm run test:api-client      # API client tests
pnpm run test:api-integration # Integration tests
pnpm run test:api-performance # Performance tests

# Run with coverage
pnpm run test:coverage

# Watch mode
pnpm run test:watch
```

## 🔧 Development Scripts

```bash
pnpm run dev      # Start development server with hot reload
pnpm run build    # Build for production
pnpm run start    # Start production server
pnpm test         # Run test suite
```

## 📋 Example Usage

### Get Countries
```bash
curl http://localhost:3000/api/v1/country-list
```

### Get Premier League Teams (Season ID: 2012)
```bash
curl "http://localhost:3000/api/v1/league-teams?season_id=2012&include=stats"
```

### Get Today's Matches
```bash
curl "http://localhost:3000/api/v1/todays-matches?timezone=Europe/London"
```

### Get Match Details
```bash
curl "http://localhost:3000/api/v1/match?match_id=123456"
```

## 🏗️ Architecture

### Service Layer
- `FootyStatsService`: Main service wrapper around the generated API client
- `FootyStatsHelpers`: Convenience methods for common operations

### Auto-Generated Client
- Generated from OpenAPI 3.1 specification (`footy.yaml`)
- Fully typed TypeScript interfaces
- Automatic request/response validation

### Middleware
- Request logging
- Error handling
- Security headers (Helmet)
- CORS support

## 📊 API Response Format

All endpoints return responses in this format:

```json
{
  "success": true,
  "data": [...],
  "pager": {
    "current_page": 1,
    "max_page": 10,
    "results_per_page": 50,
    "total_results": 500
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔑 Environment Variables

```env
# API Configuration
FOOTBALL_API_KEY=your_api_key_here
FOOTBALL_API_BASE_URL=https://api.football-data-api.com

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 📈 Performance

- Average response time: < 200ms
- Concurrent request handling
- Automatic request retries
- Rate limiting ready

## 🛡️ Security

- Helmet.js security headers
- CORS configuration
- Input validation
- Error sanitization

## 🚀 Deployment

1. Build the project:
   ```bash
   pnpm run build
   ```

2. Start production server:
   ```bash
   pnpm start
   ```

## 📝 API Documentation

The API is fully documented in the OpenAPI 3.1 specification file `footy.yaml`. You can:

1. View it in Swagger UI
2. Generate additional client libraries
3. Import into Postman or Insomnia

## 🤝 Contributing

1. Update the OpenAPI spec in `footy.yaml`
2. Regenerate the client: `pnpm run generate-client`
3. Update service methods if needed
4. Add tests for new functionality
5. Update documentation

## 📞 Support

For issues with the Football Data API itself, refer to their documentation.
For backend issues, check the logs and test suites.

---

Built with ❤️ using TypeScript, Express, and OpenAPI 3.1
