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
  .post('/callback', async ({ cookie: { accessToken }, request }) => {
    console.log(JSON.stringify(accessToken));
    console.log(request.headers);
  });

export default authRoutes;
