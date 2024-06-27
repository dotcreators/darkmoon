import { PrismaClient } from '@prisma/client';
import Elysia, { t } from 'elysia';
import { supabase } from '../../libs/auth/supabase';

const authRoutes = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Auth'],
  },
})
  .post(
    '/access',
    async ({ query, set }) => {
      const code = process.env.ACCESS_CODE;

      if (query.accessToken === code) {
        return {
          status: 'success',
          response: code,
        };
      }

      set.status = 400;
      return {
        status: 'error',
        response: 'Invalid access token',
      };
    },
    {
      transform({ query }) {
        if (typeof query.accessToken !== 'string') {
          query.accessToken = String(query.accessToken);
        }
      },
      query: t.Object({ accessToken: t.String() }),
    }
  )
  .post('/login', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
    });

    if (!data) {
      return error;
    }
    return {
      url: data.url,
    };
  })
  .post(
    '/callback',
    async ({ body, cookie }) => {
      const { data, error } = await supabase.auth.getUser(body.access_token);

      if (error) {
        return {
          status: 'error',
          response: error.message,
        };
      }

      return {
        status: 'success',
        response: data,
      };
    },
    {
      body: t.Object({ access_token: t.String(), refresh_token: t.String() }),
    }
  );

export default authRoutes;
