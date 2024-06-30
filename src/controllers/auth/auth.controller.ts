import { PrismaClient } from '@prisma/client';
import { supabase } from '../../libs/auth/supabase';
import { GithubUser } from '../../models/GithubUser';
import { Discord, GitHub, OAuth2RequestError, generateState } from 'arctic';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { Lucia, generateId } from 'lucia';
import Elysia, { t } from 'elysia';

const prisma = new PrismaClient();
const adapter = new PrismaAdapter(
  prisma.dashboard_sessions,
  prisma.dashboard_users
);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: true,
    },
  },
});

const discord = new Discord(
  process.env.DISCORD_ID ?? '',
  process.env.DISCORD_SECRET ?? '',
  'http://localhost:8989/api/v1/auth/discord/callback'
);

const github = new GitHub(
  process.env.GITHUB_ID ?? '',
  process.env.GITHUB_SECRET ?? ''
);

const authRoutes = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Auth'],
  },
})
  .get('/discord', async ({ set, cookie: { discord_state } }) => {
    if (discord_state) {
      const state = generateState();
      const url = await discord.createAuthorizationURL(state, {
        scopes: ['identify'],
      });

      discord_state.value = state;
      discord_state.set({
        httpOnly: true,
        secure: true,
        maxAge: 60 * 10,
        path: '/',
      });

      return (set.redirect = url.toString());
    }
  })
  .get(
    '/discord/callback',
    async ({ set, query: { state, code }, cookie: { discord_state } }) => {
      const storedState = discord_state?.value;

      if (!state || !code || !discord_state || storedState !== state) {
        set.status = 400;
        return {
          status: 'error',
          response: 'Invalid Discord authorization session',
        };
      }

      try {
        const tokens = await discord.validateAuthorizationCode(code);

        console.log(tokens);

        return {
          status: 'success',
          response: tokens,
        };
      } catch (e) {
        if (e instanceof OAuth2RequestError) {
          const { message, description, request } = e;
          console.log(e.description);
        }
      }
    }
  )
  .get('/github', async ({ set, cookie: { github_state } }) => {
    if (github_state) {
      const state = generateState();
      const url = await github.createAuthorizationURL(state);

      github_state.value = state;
      github_state.set({
        httpOnly: true,
        secure: true,
        maxAge: 60 * 10,
        path: '/',
      });

      return (set.redirect = url.toString());
    }
  })
  .get(
    '/github/callback',
    async ({
      set,
      query: { state, code },
      cookie: { github_state, lucia_session },
    }) => {
      try {
        const storedState = github_state?.value;

        if (!state || !code || !github_state || storedState !== state) {
          set.status = 400;
          return {
            status: 'error',
            response: 'Invalid Github authorization session',
          };
        }

        const tokens = await github.validateAuthorizationCode(code);

        const githubUserResponse = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });
        const githubUser: GithubUser = await githubUserResponse.json();

        const existingUserReq = await prisma.dashboard_users.findMany({
          where: {
            githubId: String(githubUser.id),
          },
        });
        const existingUser = existingUserReq[0];
        if (existingUser) {
          await lucia.deleteExpiredSessions();

          const session = await lucia.createSession(
            String(existingUser.id),
            {}
          );
          const sessionCookie = lucia.createSessionCookie(session.id);

          lucia_session!.value = sessionCookie.value;
          lucia_session!.set(sessionCookie.attributes);

          return (set.redirect = '/');
        } else {
          const userId = generateId(15);

          await prisma.dashboard_users.create({
            data: {
              id: userId,
              username: String(githubUser.login),
              avatarUrl: String(githubUser.avatar_url),
              githubId: String(githubUser.id),
            },
          });

          const session = await lucia.createSession(userId, {});
          const sessionCookie = lucia.createSessionCookie(session.id);

          lucia_session!.value = sessionCookie.value;
          lucia_session!.set(sessionCookie.attributes);

          return (set.redirect = '/');
        }
      } catch (e) {
        if (e instanceof OAuth2RequestError) {
          const { message, description, request } = e;

          return {
            status: 'error',
            response: e.description,
          };
        } else if (e instanceof Error) {
          return {
            status: 'error',
            response: e.message,
          };
        }
      }
    }
  )
  .post('/logout', async ({ set, cookie: { lucia_session } }) => {
    await lucia.invalidateSession(lucia_session?.value);
    const sessionCookie = lucia.createBlankSessionCookie();

    lucia_session!.value = sessionCookie.value;
    lucia_session!.set(sessionCookie.attributes);

    return (set.headers['Redirect'] = '/');
  });
// .post('/login', async () => {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'discord',
//   });

//   if (!data) {
//     return error;
//   }
//   return {
//     url: data.url,
//   };
// })
// .post(
//   '/callback',
//   async ({ body }) => {
//     const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

//     const { data, error } = await supabase.auth.getUser(body.accessToken);
//     if (data.user?.id !== ADMIN_USER_ID) {
//       return {
//         status: 'error',
//         response: 'User is not admin.',
//       };
//     }

//     return {
//       status: 'success',
//       response: true,
//     };
//   },
//   {
//     body: t.Object({ accessToken: t.String() }),
//   }
// );

export default authRoutes;
