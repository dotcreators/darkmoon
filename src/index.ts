import { Elysia } from 'elysia';
import artistsRoutes from './controllers/artists/artists.controller';
import swagger from '@elysiajs/swagger';
import suggestionsRoutes from './controllers/suggestions/suggestions.controller';
import cors from '@elysiajs/cors';
import fetchRoutes from './controllers/fetch/fetch.controller';
import trendsRoutes from './controllers/trends/trends.controller';

export const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Dotcreators API Documentation',
          description:
            'Dotcreators is a project aimed at promoting pixel artists, statistics trending and creating a close community',
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
  .listen(8989);

console.log(
  `🚀 Dotcreators API service is running at ${app.server?.hostname}:${app.server?.port}`
);
