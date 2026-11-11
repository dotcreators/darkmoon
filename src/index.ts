import { envConfig } from './env.config';
import cookie from '@elysiajs/cookie';
import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { API_ENDPOINTS_V2 } from 'controllers/v2';
import { Elysia } from 'elysia';

const ALLOWED_ORIGINS = [/^https:\/\/([a-z0-9-]+\.)*dotcreators\.xyz$/, /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/];

export const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Dotcreators API Documentation',
          description:
            'Dotcreators is service which allow users discover new creators, track growing trend and share talented pixel-related artists with others.',
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
      origin: envConfig.IS_DEVELOPMENT ? true : ALLOWED_ORIGINS,
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
      maxAge: 500,
    })
  )
  .get('/', ({ redirect }) => {
    return redirect('/welcome');
  })
  .get('/welcome', () => {
    return {
      message: 'Welcome to dotcreators API service',
      name: 'dotcreators-darkmoon',
      version: 'v2.0.0',
      docs: '/docs',
    };
  })
  .use(API_ENDPOINTS_V2);

app.listen(8989);

console.log(`Dotcreators API service is running`);
console.log('Dotcreators API working in development mode:', envConfig.IS_DEVELOPMENT);
