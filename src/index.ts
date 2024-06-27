import { Elysia } from 'elysia';
import artistsRoutes from './controllers/artists/artists.controller';
import swagger from '@elysiajs/swagger';
import suggestionsRoutes from './controllers/suggestions/suggestions.controller';
import cors from '@elysiajs/cors';
import fetchRoutes from './controllers/fetch/fetch.controller';
import trendsRoutes from './controllers/trends/trends.controller';
import authRoutes from './controllers/auth/auth.controller';
import { rateLimit } from 'elysia-rate-limit';
import cookie from '@elysiajs/cookie';

const IS_DEV = process.env.IS_DEV;

export const app = new Elysia()
  .use(
    cookie({
      httpOnly: true,
      secure: true,
      // sameSite: 'strict',

      // If you want to encrypt a cookie
      // signed: true,
      // secret: process.env.COOKIE_SECRET,
    })
  )
  .use(
    cors({
      // origin: [
      //   'https://dotcreators.xyz/',
      //   'https://www.dotcreators.xyz/',
      //   'https://dashboard.dotcreators.xyz/',
      //   'http://localhost:3001/',
      //   'http://localhost:3000/',
      // ],
      origin: /(.*\.)?dotcreators\.xyz$/,
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
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
  .group('/api/v1', app => app.use(authRoutes));

IS_DEV !== 'true' &&
  app.use(
    rateLimit({
      max: 100,
      errorResponse: 'Rate-limit reached',
    })
  );

app.listen(8989);

console.log(
  `🚀 Dotcreators API service is running at ${app.server?.hostname}:${app.server?.port}`
);
