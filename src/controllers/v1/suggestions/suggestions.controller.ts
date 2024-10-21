import Elysia from 'elysia';
import { SuggestionsServices } from './suggestions.services';
import {
  ArtistEditSuggestionSchema,
  ArtistsCreateSuggestionSchema,
  ArtistsSuggestionSchema,
} from './suggestions.schema';
import { suggestionsResponses } from '../../../models/responses/SuggestionsResponses';
import { errorResponses } from '../../../models/responses/ErrorsResponses';
import { lucia } from '../auth/auth.controller';
import { PrismaClient } from '@prisma/client';

const suggestionsServices: SuggestionsServices = new SuggestionsServices();
const prisma = new PrismaClient();

const suggestionsRoutes = new Elysia({
  prefix: '/suggestions',
  detail: {
    tags: ['v1'],
  },
})
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const suggestedArtists =
          await suggestionsServices.getSuggestionsPaginated(query);

        return {
          status: 'success',
          response: {
            data: suggestedArtists.data,
            has_next: suggestedArtists.has_next,
          },
        };
      } catch (e) {
        set.status = 500;
        return {
          status: 'error',
          response: e,
        };
      }
    },
    {
      transform() {},
      query: ArtistsSuggestionSchema,
      response: {
        200: suggestionsResponses['suggestions.get'],
        400: errorResponses['api.badrequest'],
        500: errorResponses['api.error'],
      },
    }
  )
  .get(
    '/check/:username',
    async ({ params: { username }, set }) => {
      try {
        const isArtistExist = await suggestionsServices.checkUser(username);

        return {
          status: 'success',
          response: isArtistExist,
        };
      } catch (e) {
        set.status = 500;
        return {
          status: 'error',
          response: e,
        };
      }
    },
    {
      transform() {},
      response: {
        200: suggestionsResponses['suggestions.check'],
        400: errorResponses['api.badrequest'],
        500: errorResponses['api.error'],
      },
    }
  )
  .post(
    '/',
    async ({ body, set }) => {
      try {
        suggestionsServices.createSuggestion(body);
        return {
          status: 'success',
          response: 'Artist suggestion successfully created',
        };
      } catch (e) {
        set.status = 500;
        return {
          status: 'error',
          response: e,
        };
      }
    },
    {
      transform({ body }) {
        if (typeof body.tags === 'string') {
          body.tags = [body.tags];
        }
      },
      body: ArtistsCreateSuggestionSchema,
      response: {
        200: suggestionsResponses['suggestions.create'],
        400: errorResponses['api.badrequest'],
        500: errorResponses['api.error'],
      },
    }
  )
  .guard(
    {
      async beforeHandle({ set, cookie: { lucia_session } }) {
        if (lucia_session && lucia_session.value) {
          const { user } = await lucia.validateSession(lucia_session.value);
          if (!user) return (set.status = 'Unauthorized');
        } else {
          return (set.status = 'Unauthorized');
        }
      },
    },
    app =>
      app.patch(
        '/:suggestionId',
        async ({ params: { suggestionId }, query, set }) => {
          try {
            const suggestion = await suggestionsServices.updateStatusSuggestion(
              suggestionId,
              query.requestStatus,
              query.country ?? undefined,
              query.tags ?? undefined
            );

            return {
              status: 'success',
              response: suggestion,
            };
          } catch (e) {
            set.status = 500;
            return {
              status: 'error',
              response: e,
            };
          }
        },
        {
          transform({ query }) {
            if (typeof query.tags === 'string') {
              const tags = query.tags as string;
              query.tags = tags.split(',');
            }
          },
          query: ArtistEditSuggestionSchema,
          response: {
            200: suggestionsResponses['suggestions.update'],
            400: errorResponses['api.badrequest'],
            500: errorResponses['api.error'],
          },
        }
      )
  );
export default suggestionsRoutes;
