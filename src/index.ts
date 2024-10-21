import { Elysia, StatusMap } from 'elysia';
import artistsRoutes from './controllers/v1/artists/artists.controller';
import swagger from '@elysiajs/swagger';
import suggestionsRoutes from './controllers/v1/suggestions/suggestions.controller';
import cors from '@elysiajs/cors';
import fetchRoutes from './controllers/v1/fetch/fetch.controller';
import trendsRoutes from './controllers/v1/trends/trends.controller';
import authRoutes from './controllers/v1/auth/auth.controller';
import { rateLimit } from 'elysia-rate-limit';
import cookie from '@elysiajs/cookie';
import { envConfig } from './env.config';
import artistsRoutesV2 from './controllers/v2/artists/artists.controller';

export const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Dotcreators API Documentation',
          description:
            'Dotcreators is service which allow users discover new creators, track growing trend and share talented pixel-related artists with others.\n\n' +
            'Search in left menu specified endpoint to continue or just scroll down.',
          contact: {
            email: 'hi@anivire.xyz',
            url: 'https://github.com/dotcreators',
          },
          version: '1.0.1',
        },
        tags: [
          { name: 'Artists', description: 'Artists related endpoints' },
          {
            name: 'Suggestions',
            description: 'Artist suggestions related endpoints',
          },
          {
            name: 'Fetch',
            description: 'Getting X/Twitter artist profiles related endpoints',
          },
          {
            name: 'Trends',
            description: 'Artist trends related endpoints',
          },
        ],
      },
      path: '/docs',
    })
  )
  .use(
    cookie({
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: !envConfig.IS_DEVELOPMENT ? '.dotcreators.xyz' : undefined,
      maxAge: 60 * 10,
      path: '/',
    })
  )
  .use(
    cors({
      origin: !envConfig.IS_DEVELOPMENT ? /(.*\.)?dotcreators\.xyz$/ : true,
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 500,
    })
  )
  .onError(({ error, code }) => {
    return {
      status: code,
      response: {
        error: code === 'VALIDATION' ? 'Validation error' : error.name,
        message:
          code === 'VALIDATION' ? JSON.parse(error.message) : error.message,
        ...(envConfig.IS_DEVELOPMENT && error.stack && code !== 'VALIDATION'
          ? { stack: error.stack }
          : {}),
      },
    };
  })
  .group('/v1', app => app.use(artistsRoutes))
  .group('/v1', app => app.use(suggestionsRoutes))
  .group('/v1', app => app.use(fetchRoutes))
  .group('/v1', app => app.use(trendsRoutes))
  .group('/v1', app => app.use(authRoutes))
  .group('/v2', app => app.use(artistsRoutesV2));

if (!envConfig.IS_DEVELOPMENT) {
  app.use(
    rateLimit({
      max: 100,
      errorResponse: 'Rate-limit reached',
    })
  );
}

app.listen(8989);

console.log(
  `🚀 Dotcreators API service is running at ${app.server?.hostname}:${app.server?.port}`
);
