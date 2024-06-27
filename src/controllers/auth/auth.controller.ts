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
  .post('/callback', async ({ cookie: { accessToken }, request }) => {
    console.log(JSON.stringify(accessToken));
    console.log(request.headers);
  });

export default authRoutes;
