import { PrismaClient } from '@prisma/client';
import { GithubUser } from '../../../models/GithubUser';
import { GitHub, OAuth2RequestError, generateState } from 'arctic';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { Lucia, generateId } from 'lucia';
import Elysia, { t } from 'elysia';

const IS_DEV = process.env.IS_DEV;

const prisma = new PrismaClient();
const adapter = new PrismaAdapter(prisma.authSessions, prisma.authUsers);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: true,
      sameSite: 'none',
      domain: !IS_DEV ? '.dotcreators.xyz' : undefined,
      path: '/',
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
        sameSite: 'none',
        domain: !IS_DEV ? '.dotcreators.xyz' : undefined,
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

        const existingUserReq = await prisma.authUsers.findMany({
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

          return (set.redirect = !IS_DEV
            ? 'https://dashboard.dotcreators.xyz/'
            : 'http://localhost:3000');
        } else {
          // Temporarily remove account creation while authorizing
          return (set.redirect = !IS_DEV
            ? 'https://dashboard.dotcreators.xyz/'
            : 'http://localhost:3000');

          const userId = generateId(15);

          await prisma.authUsers.create({
            data: {
              id: userId,
              username: String(githubUser.login),
              avatarUrl: String(githubUser.avatar_url),
              githubId: String(githubUser.id),
            },
          });

          console.log(userId);

          const session = await lucia.createSession(userId, {});
          const sessionCookie = lucia.createSessionCookie(session.id);

          lucia_session!.value = sessionCookie.value;
          lucia_session!.set(sessionCookie.attributes);

          return (set.redirect = !IS_DEV
            ? 'https://dashboard.dotcreators.xyz/'
            : 'http://localhost:3000');
        }
      } catch (e) {
        if (e instanceof OAuth2RequestError) {
          const { message, description, request } = e;

          return {
            status: 'error',
            response: e.description,
          };
        } else if (e instanceof Error) {
          console.log(e);
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

    return (set.headers['Redirect'] = !IS_DEV
      ? 'https://dashboard.dotcreators.xyz/'
      : 'http://localhost:3000');
  })
  .get('user', async ({ set, request, cookie: { lucia_session } }) => {
    try {
      console.log(request);
      if (lucia_session && lucia_session.value) {
        const session = await prisma.authSessions.findMany({
          where: {
            id: lucia_session?.value,
          },
        });
        if (session) {
          const user = await prisma.authUsers.findMany({
            where: {
              id: session[0]?.userId,
            },
          });

          return {
            status: 'success',
            response: user,
          };
        }
      } else {
        throw new Error('Lucia session value is empty');
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
