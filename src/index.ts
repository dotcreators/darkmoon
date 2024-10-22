import { Elysia } from 'elysia';
import swagger from '@elysiajs/swagger';
import cors from '@elysiajs/cors';
import { rateLimit } from 'elysia-rate-limit';
import cookie from '@elysiajs/cookie';
import { envConfig } from './env.config';
import { apiEndpointsV2 } from 'controllers/v2';
import { apiEndpointsV1 } from 'controllers/v1';
import { Logestic } from 'logestic';

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
        // tags: [
        //   { name: 'Artists', description: 'Artists related endpoints' },
        //   {
        //     name: 'Suggestions',
        //     description: 'Artist suggestions related endpoints',
        //   },
        //   {
        //     name: 'Fetch',
        //     description: 'Getting X/Twitter artist profiles related endpoints',
        //   },
        //   {
        //     name: 'Trends',
        //     description: 'Artist trends related endpoints',
        //   },
        // ],
      },
      path: '/docs',
    })
  )
  .use(Logestic.preset('fancy'))
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
  .onError(({ error, code, redirect }) => {
    if (code === 'NOT_FOUND') {
      return redirect('/welcome', 302);
    }

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
  .get(
    '/welcome',
    () => {
      return {
        message: 'Welcome to dotcreators API service',
        name: 'dotcreators-darkmoon',
        version: 'v1.0.1',
        docs: '/docs',
      };
    },
    {}
  )
  .use(apiEndpointsV1)
  .use(apiEndpointsV2);

if (!envConfig.IS_DEVELOPMENT) {
  app.use(
    rateLimit({
      max: 100,
      errorResponse: 'Rate-limit reached',
    })
  );
}

app.listen(8989);

console.log(`🚀 Dotcreators API service is running.`);
