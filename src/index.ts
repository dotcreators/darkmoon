import { envConfig } from './env.config';
import cookie from '@elysiajs/cookie';
import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { API_ENDPOINTS_V2 } from 'controllers/v2';
import { Elysia } from 'elysia';
import { rateLimit } from 'elysia-rate-limit';

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
          version: '2.0.0',
        },
      },
      path: '/docs',
      exclude: ['/', '/welcome'],
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
  .get('/', ({ redirect }) => {
    return redirect('/welcome');
  })
  .get(
    '/welcome',
    () => {
      return {
        message: 'Welcome to dotcreators API service',
        name: 'dotcreators-darkmoon',
        version: 'v2.0.0',
        docs: '/docs',
      };
    },
    {}
  )
  .use(API_ENDPOINTS_V2);

if (!envConfig.IS_DEVELOPMENT) {
  app.use(
    rateLimit({
      max: 100,
      errorResponse: 'Rate-limit reached',
    })
  );
}

app.listen(8989);

console.log(`Dotcreators API service is running`);
console.log('Dotcreators API working in development mode:', envConfig.IS_DEVELOPMENT);
