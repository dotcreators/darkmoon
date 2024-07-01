import Elysia from 'elysia';
import { errorResponses } from '../../models/responses/ErrorsResponses';
import { fetchResponses } from '../../models/responses/FetchResponses';
import { FetchServices } from './fetch.services';
import { sendDiscordMessage } from '../../utils/discordService';

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

      return {
        status: 'success',
        response: profile,
      };
    } catch (e) {
      set.status = 500;
      console.log(e);
      console.log(request);

      if (e instanceof Error) {
        sendDiscordMessage(
          e.name,
          `${e.message}\n\n\`url: ${request.url}\``,
          'error'
        );
        return {
          status: 'error',
          response: e.message,
        };
      } else {
        sendDiscordMessage(
          'UnknownError',
          `${e}\n\n\`url: ${request.url}\``,
          'error'
        );
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
