import Elysia, { t } from 'elysia';

// Temp auth system :_;
const authRoutes = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Auth'],
  },
}).post(
  '/',
  async ({ query, set }) => {
    const code = process.env.ACCESS_CODE;

    console.log(query);
    console.log(query.accessToken);

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

export default authRoutes;
