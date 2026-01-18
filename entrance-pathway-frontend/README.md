# Entrance Pathway - Frontend

Next.js 14 frontend for the Entrance Pathway EdTech platform.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run codegen` - Generate GraphQL types

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Student dashboard
│   ├── courses/            # Course pages
│   ├── exams/              # Exam pages
│   └── admin/              # Admin pages
├── components/             # React components
│   └── ui/                 # Reusable UI components
├── graphql/                # GraphQL operations
│   ├── queries/            # GraphQL queries
│   ├── mutations/          # GraphQL mutations
│   └── generated/          # Auto-generated types
├── hooks/                  # Custom React hooks
├── lib/                    # Library configurations
│   ├── apollo/             # Apollo Client setup
│   ├── react-query/        # React Query provider
│   └── supabase/           # Supabase client
├── types/                  # TypeScript definitions
└── utils/                  # Utility functions
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL API endpoint |
| `NEXT_PUBLIC_ZOOM_SDK_KEY` | Zoom SDK key |
| `ZOOM_SDK_SECRET` | Zoom SDK secret |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Supabase](https://supabase.com/docs)
