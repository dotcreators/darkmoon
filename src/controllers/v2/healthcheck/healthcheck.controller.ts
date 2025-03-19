import Elysia from 'elysia';

const healthcheckRoutes = new Elysia({
  prefix: '/health-check',
  detail: {
    tags: ['Healh-check'],
  },
}).get(
  '/status',
  async () => {
    const response = await fetch('https://uptime.betterstack.com/api/v2/status-pages/211117', {
      headers: {
        Authorization: `Bearer ${process.env.UPTIME_API_TOKEN}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { status: data.data.attributes.aggregate_state };
    }

    return { status: null };
  },
  { detail: { summary: 'Uptime status', description: 'Get overall status of dotcreators infrastructure' } }
);

export { healthcheckRoutes };
