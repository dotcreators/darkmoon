import { Elysia, t } from 'elysia';
import { ArtistsServices } from './artists.services';
import {
  ArtistAddSchema,
  ArtistEditSchema,
  ArtistUpdateSchema,
  ArtistsSearchSchema,
  BulkArtistAddSchema,
  BulkArtistUpdateSchema,
} from './artists.schema';
import { artistsResponses } from '../../models/responses/ArtistsReponses';
import { errorResponses } from '../../models/responses/ErrorsResponses';
import { lucia } from '../auth/auth.controller';

const artistsServices: ArtistsServices = new ArtistsServices();

const artistsRoutes = new Elysia({
  prefix: '/artists',
  detail: {
    tags: ['Artists'],
  },
})
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const artists = await artistsServices.getArtistsPaginated(query);
        return {
          status: 'success',
          response: {
            data: artists.data,
            has_next: artists.has_next,
            total_pages: artists.total_pages,
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
      transform({ query }) {
        if (typeof query.tags === 'string') {
          query.tags = [query.tags];
        }
      },
      beforeHandle({ query, error, set }) {
        if (query.limit > 100) {
          set.status = 400;
          return {
            status: 'error',
            response: 'Maximum artists query limit is 100!',
          };
        }
      },
      query: ArtistsSearchSchema,
      response: {
        200: artistsResponses['artists.get'],
        400: errorResponses['api.badrequest'],
        500: errorResponses['api.error'],
      },
    }
  )
  .get(
    '/usernames',
    async ({ set }) => {
      try {
        const artists: string[] = await artistsServices.getArtistsUsernames();
        return {
          status: 'success',
          response: artists,
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
      beforeHandle() {},
      response: {
        200: artistsResponses['artists.usernames'],
        400: errorResponses['api.badrequest'],
        500: errorResponses['api.error'],
      },
    }
  )
  .get(
    '/random',
    async ({ set }) => {
      try {
        const artist = await artistsServices.getArtistsRandom();
        return {
          status: 'success',
          response: artist,
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
      beforeHandle() {},
      response: {
        200: artistsResponses['artists.random'],
        400: errorResponses['api.badrequest'],
        500: errorResponses['api.error'],
      },
    }
  )
  .guard(
    {
      async beforeHandle({ set, cookie: { lucia_session } }) {
        if (lucia_session) {
          const { user } = await lucia.validateSession(lucia_session.value);
          if (!user) return (set.status = 'Unauthorized');
        } else {
          return (set.status = 'Unauthorized');
        }
      },
    },
    app =>
      app
        .post(
          '/',
          async ({ body, set }) => {
            try {
              const createdArtists = await artistsServices.createArtist(body);
              return {
                status: 'success',
                response: createdArtists,
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
            body: ArtistAddSchema,
            response: {
              200: artistsResponses['artists.create'],
              400: errorResponses['api.badrequest'],
              500: errorResponses['api.error'],
            },
          }
        )
        .post(
          '/bulk',
          async ({ body, set }) => {
            try {
              const createdArtistsCount =
                await artistsServices.bulkCreateArtist(body);
              return {
                status: 'success',
                response: createdArtistsCount,
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
            body: BulkArtistAddSchema,
            response: {
              200: artistsResponses['artists.createBulk'],
              400: errorResponses['api.badrequest'],
              500: errorResponses['api.error'],
            },
          }
        )
        .patch(
          '/:artistId',
          async ({ params: { artistId }, query, set }) => {
            try {
              const editedArtist = await artistsServices.editArtist(
                artistId,
                query
              );
              return {
                status: 'success',
                response: editedArtist,
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
                query.tags = [query.tags];
              }
            },
            beforeHandle({ query, set }) {
              if (Object.keys(query).length === 0) set.status = 400;
              return {
                status: 'error',
                response:
                  'Specify at least 1 of user edit options are represented!',
              };
            },
            query: ArtistEditSchema,
            response: {
              200: artistsResponses['artists.get'],
              400: errorResponses['api.badrequest'],
              500: errorResponses['api.error'],
            },
          }
        )
        .patch(
          '/stats/single/:artistId',
          async ({ params: { artistId }, query, set }) => {
            try {
              const updatedArtist = await artistsServices.updateArtistStats(
                artistId,
                query
              );
              return {
                status: 'success',
                response: updatedArtist,
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
            query: ArtistUpdateSchema,
            response: {
              200: artistsResponses['artists.updateSingle'],
              400: errorResponses['api.badrequest'],
              500: errorResponses['api.error'],
            },
          }
        )
        .patch(
          '/stats/bulk',
          async ({ body, set }) => {
            try {
              const updatedArtistsCount =
                await artistsServices.bulkUpdateArtistsStats(body);
              return {
                status: 'success',
                response: updatedArtistsCount,
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
            body: BulkArtistUpdateSchema,
            response: {
              200: artistsResponses['artists.updateBulk'],
              400: errorResponses['api.badrequest'],
              500: errorResponses['api.error'],
            },
          }
        )
        .delete(
          '/:artistId',
          async ({ params: { artistId }, set }) => {
            try {
              artistsServices.deleteArtist(artistId);
              return {
                status: 'success',
                response: 'OK Gone',
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
              200: artistsResponses['artists.delete'],
              400: errorResponses['api.badrequest'],
              500: errorResponses['api.error'],
            },
          }
        )
        .delete(
          '/bulk',
          ({ body, set }) => {
            try {
              artistsServices.bulkDeleteArtists(<string[]>body);
              return {
                status: 'success',
                response: 'OK Gone',
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
              200: artistsResponses['artists.delete'],
              400: errorResponses['api.badrequest'],
              500: errorResponses['api.error'],
            },
          }
        )
  );

export default artistsRoutes;
