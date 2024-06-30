import { PrismaClient } from '@prisma/client';
import { GithubUser } from '../../models/GithubUser';
import { GitHub, OAuth2RequestError, generateState } from 'arctic';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { Lucia, generateId } from 'lucia';
import Elysia, { t } from 'elysia';

const prisma = new PrismaClient();
const adapter = new PrismaAdapter(
  prisma.dashboard_sessions,
  prisma.dashboard_users
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: true,
      sameSite: 'none',
      domain: '.dotcreators.xyz',
    },
  },
});

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
  .get('/github', async ({ set, cookie: { github_state } }) => {
    if (github_state) {
      const state = generateState();
      const url = await github.createAuthorizationURL(state);

      github_state.value = state;
      github_state.set({
        httpOnly: true,
        secure: true,
        maxAge: 60 * 10,
        sameSite: 'none',
        domain: '.dotcreators.xyz',
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
          console.log();
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

          return (set.redirect = 'https://dashboard.dotcreators.xyz/');
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

          return (set.redirect = 'https://dashboard.dotcreators.xyz/');
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

    return (set.headers['Redirect'] = 'http://dashboard.dotcreators.xyz/');
  })
  .get('user', async ({ set, cookie: { lucia_session } }) => {
    try {
      if (lucia_session?.value) {
        const session = await prisma.dashboard_sessions.findMany({
          where: {
            id: lucia_session?.value,
          },
        });
        if (session) {
          const user = await prisma.dashboard_users.findMany({
            where: {
              id: session[0]?.userId,
            },
          });

          return {
            status: 'success',
            response: user,
          };
        }
      }
    } catch (e) {
      set.status = 400;
      return {
        status: 'error',
        response: e instanceof Error && e.message,
      };
    }
  });

export default authRoutes;
