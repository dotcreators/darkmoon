import Elysia from 'elysia';

const healthcheckRoutes = new Elysia({
  prefix: '/health-check',
  detail: {
    tags: ['v2'],
  },
}).get('/', async () => {
  return true;
});

export { healthcheckRoutes };
