import { Elysia } from 'elysia';
import artistsRoutes from './controllers/artists/artists.controller';
import swagger from '@elysiajs/swagger';
import suggestionsRoutes from './controllers/suggestions/suggestions.controller';
import cors from '@elysiajs/cors';
import fetchRoutes from './controllers/fetch/fetch.controller';
import trendsRoutes from './controllers/trends/trends.controller';
import authRoutes from './controllers/auth/auth.controller';

let parentUrl = process.env.PARENT_URL;

export const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 500,
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Dotcreators API Documentation',
          description:
            'Track, share and grow together with community of talented pixel-related artists',
          contact: { email: 'admin@dotcreators.xyz' },
          version: '1.0.1',
        },
        tags: [{ name: 'Artists', description: 'Artists endpoints' }],
      },
    })
  )
  .onError(({ error }) => {
    return new Response(error.toString());
  })
  .group('/api/v1', app => app.use(artistsRoutes))
  .group('/api/v1', app => app.use(suggestionsRoutes))
  .group('/api/v1', app => app.use(fetchRoutes))
  .group('/api/v1', app => app.use(trendsRoutes))
  .group('/api/v1', app => app.use(authRoutes))
  .listen(8989);

console.log(
  `🚀 Dotcreators API service is running at ${app.server?.hostname}:${app.server?.port}`
);
