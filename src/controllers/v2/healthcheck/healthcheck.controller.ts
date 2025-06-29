import Elysia from 'elysia';
import { TwitterOpenApi } from 'twitter-openapi-typescript';

const healthcheckRoutes = new Elysia({
  prefix: '/health-check',
  detail: {
    tags: ['Healh-check'],
  },
})
  .get(
    '/status',
    async ({ set }) => {
      const response = await fetch('https://uptime.betterstack.com/api/v2/status-pages/211117', {
        headers: {
          Authorization: `Bearer ${process.env.UPTIME_API_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { status: data.data.attributes.aggregate_state };
      }

      set.status = 'Internal Server Error';
      return { status: null };
    },
    { detail: { summary: 'Uptime status', description: 'Get overall status of dotcreators infrastructure' } }
  )
  .get(
    '/status/worker',
    async ({ set }) => {
      const api = new TwitterOpenApi();
      const twitterClient = await api.getGuestClient();

      const r = await twitterClient.getUserApi().getUserByScreenName({ screenName: 'aniv1re' });

      if (r && r.data && r.data.user) {
        return { status: 'Success', other: r.data.user.legacy.screenName };
      }

      set.status = 'Internal Server Error';
      return { status: null };
    },
    { detail: { summary: 'Uptime worker status', description: 'Get status of dotcreators worker' } }
  );

export { healthcheckRoutes };
