# Entrance Pathway - Backend

Express.js + Apollo Server GraphQL API for the Entrance Pathway EdTech platform.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── config/                 # Configuration files
│   ├── env.ts              # Environment validation
│   └── supabase.ts         # Supabase client setup
├── middleware/             # Express middleware
│   └── auth.ts             # Authentication middleware
├── models/                 # Database type definitions
│   └── types.ts            # Row types for Supabase tables
├── resolvers/              # GraphQL resolvers
│   ├── users.ts            # User queries
│   ├── courses.ts          # Course queries/mutations
│   ├── questions.ts        # Question queries/mutations
│   └── exams.ts            # Exam queries/mutations
├── schema/                 # GraphQL schema
│   └── typeDefs.ts         # Type definitions
├── utils/                  # Utility functions
│   ├── helpers.ts          # Data transformation
│   └── errors.ts           # Custom GraphQL errors
└── index.ts                # Server entry point
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `NODE_ENV` | Environment (development/production) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `JWT_SECRET` | JWT secret (Supabase JWT secret) |
| `CORS_ORIGIN` | Allowed CORS origins |

## API Endpoints

- `GET /health` - Health check
- `POST /graphql` - GraphQL endpoint
- `GET /graphql` - GraphQL Playground (development only)

## Authentication

The API uses JWT tokens from Supabase Auth. Include the token in requests:

```
Authorization: Bearer <access_token>
```

## GraphQL Schema

Access the GraphQL Playground at `http://localhost:4000/graphql` to explore the full schema.

### Main Types

- **User** - User profiles and authentication
- **Course** - Educational courses with chapters and lessons
- **Question** - Practice questions with multiple choice options
- **Exam** - Timed exams with scoring
- **Enrollment** - Course enrollments and progress

## Learn More

- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/docs)
