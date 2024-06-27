import { PrismaClient } from '@prisma/client';
import Elysia, { t } from 'elysia';
import { supabase } from '../../libs/auth/supabase';

const authRoutes = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Auth'],
  },
})
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
    async ({ body }) => {
      const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

      const { data, error } = await supabase.auth.getUser(body.accessToken);
      if (data.user?.id !== ADMIN_USER_ID) {
        return {
          status: 'error',
          response: 'User is not admin.',
        };
      }

      return {
        status: 'success',
        response: true,
      };
    },
    {
      body: t.Object({ accessToken: t.String() }),
    }
  );

export default authRoutes;
