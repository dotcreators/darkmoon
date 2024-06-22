import { PrismaClient } from '@prisma/client';
import Elysia, { t } from 'elysia';
import { supabase } from '../../libs/auth/supabase';

const authRoutes = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Auth'],
  },
}).post(
  '/',
  async ({ query, set }) => {
    const code = process.env.ACCESS_CODE;

    if (query.accessToken === code) {
      return {
        status: 'success',
        response: code,
      };
    } else {
      set.status = 400;
      return {
        status: 'error',
        response: 'Invalid access token',
      };
    }
  },
  {
    transform({ query }) {
      if (typeof query.accessToken !== 'string') {
        query.accessToken = String(query.accessToken);
      }
    },
    query: t.Object({ accessToken: t.String() }),
  }
);

// const authRoutes = new Elysia({
//   prefix: '/auth',
//   detail: {
//     tags: ['Auth'],
//   },
// })
//   .post('/login', async () => {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: 'discord',
//       options: {
//         redirectTo: `localhost:8989/auth/callback`,
//       },
//     });

//     if (data) {
//       return {
//         url: data.url,
//       };
//     } else {
//       return error;
//     }
//   })
//   .post(
//     '/callback',
//     async ({ query, cookie }) => {
//       const { data, error } = await supabase.auth.getUser(query.access_token);

//       return data.user?.user_metadata;
//     },
//     {
//       query: t.Object({ access_token: t.String() }),
//     }
//   );

export default authRoutes;
