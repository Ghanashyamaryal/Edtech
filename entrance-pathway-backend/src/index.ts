import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';

import { env } from './config';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { authMiddleware, extractToken, verifyToken, AuthenticatedRequest } from './middleware';
import { Context } from './resolvers/types';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Create Apollo Server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        path: error.path,
      };
    },
  });

  await server.start();

  // Middleware
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GraphQL endpoint
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: env.CORS_ORIGIN.split(','),
      credentials: true,
    }),
    express.json(),
    authMiddleware,
    expressMiddleware(server, {
      context: async ({ req }): Promise<Context> => {
        const authReq = req as AuthenticatedRequest;
        const token = extractToken(req);

        return {
          user: authReq.user || null,
          token,
        };
      },
    })
  );

  // Start server
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: parseInt(env.PORT) }, resolve);
  });

  console.log(`
  🚀 Server ready!

  GraphQL:  http://localhost:${env.PORT}/graphql
  Health:   http://localhost:${env.PORT}/health

  Environment: ${env.NODE_ENV}
  `);
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
