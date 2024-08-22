import Elysia from 'elysia';
import { errorResponses } from '../../models/responses/ErrorsResponses';
import { fetchResponses } from '../../models/responses/FetchResponses';
import { FetchServices } from './fetch.services';
import { sendDiscordMessage } from '../../utils/webhookService';

const fetchServices: FetchServices = new FetchServices();

const fetchRoutes = new Elysia({
  prefix: '/fetch',
  detail: {
    tags: ['Fetch'],
  },
}).get(
  ':username',
  async ({ params: { username }, set, request }) => {
    try {
      const profile = await fetchServices.getTwitterProfile(username);

      if (profile !== null) {
        return {
          status: 'success',
          response: profile,
        };
      } else {
        set.status = 400;
        return {
          status: 'error',
          response: 'User not found',
        };
      }
    } catch (e) {
      set.status = 500;

      if (
        e instanceof Error &&
        e.message !== 'rest_id not found.' &&
        e.message !== 'User not found.'
      ) {
        return {
          status: 'error',
          response: 'User not found',
        };
      } else {
        return {
          status: 'error',
          response: e,
        };
      }
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
