import Elysia from 'elysia';
import { errorResponses } from '../../models/responses/ErrorsResponses';
import { fetchResponses } from '../../models/responses/FetchResponses';
import { FetchServices } from './fetch.services';

const fetchServices: FetchServices = new FetchServices();

const fetchRoutes = new Elysia({
  prefix: '/fetch',
  detail: {
    tags: ['Fetch'],
  },
}).get(
  ':userTag',
  async ({ params: { userTag }, set }) => {
    try {
      const profile = await fetchServices.getTwitterProfile(userTag);
      return {
        status: 'success',
        response: profile,
      };
    } catch (e) {
      set.status = 500;
      console.log(e);
      return {
        status: 'error',
        response: e instanceof Error ? e.message : e,
      };
    }
  },
  {
    transform() {},
    response: {
      200: fetchResponses['fetch.profile'],
      400: errorResponses['api.badrequest'],
      500: errorResponses['api.error'],
    },
  }
);

export default fetchRoutes;
