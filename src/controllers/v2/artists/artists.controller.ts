import { Elysia, error, StatusMap, t } from 'elysia';

import { ErrorResponseModel } from '../schemas/error.schema';
import ArtistsService from './artists.service';
import { ArtistsQueryModel } from './schemas/artists.query';
import { ArtistsReponseModel } from './schemas/artists.response';
import { ArtistsBodyModel } from './schemas/artists.body';
import { ArtistsParamsMode } from './schemas/artists.params';

const artistsService = new ArtistsService();

const artistsRoutes = new Elysia({
  prefix: '/artists',
  detail: {
    tags: ['Artists'],
  },
})
  .get(
    '/search',
    async ({ query }) => {
      if (query.perPage > 100 || query.perPage < 0) {
        return error(400, {
          status: StatusMap['Bad Request'],
          response: {
            error: 'Query error',
            message: 'Maximum artists query must be greater than 0 and limited by 100',
          },
        });
      } else if (query.page < 0) {
        return error(400, {
          status: StatusMap['Bad Request'],
          response: {
            error: 'Query error',
            message: 'Page value must be greater than 0',
          },
        });
      }

      return await artistsService.getArtistsPaginated(query);
    },
    {
      transform({ query }) {
        if (typeof query.tags === 'string') {
          query.tags = [query.tags];
        }
      },
      query: ArtistsQueryModel.GetArtist,
      response: {
        200: ArtistsReponseModel.GetArtist,
        400: ErrorResponseModel.BadRequest,
        500: ErrorResponseModel.InternalServerError,
      },
      detail: {
        summary: 'Search artists',
      },
    }
  )
  .get(
    '/search/include-trends',
    async ({ query }) => {
      if (query.perPage > 100 || query.perPage < 0) {
        return error(400, {
          status: StatusMap['Bad Request'],
          response: {
            error: 'Query error',
            message: 'Maximum artists query must be greater than 0 and limited by 100',
          },
        });
      } else if (query.page < 0) {
        return error(400, {
          status: StatusMap['Bad Request'],
          response: {
            error: 'Query error',
            message: 'Page value must be greater than 0',
          },
        });
      }

      return await artistsService.getArtistsWithTrendsPaginated(query);
    },
    {
      transform({ query }) {
        if (typeof query.tags === 'string') {
          query.tags = [query.tags];
        }
      },
      query: ArtistsQueryModel.GetArtist,
      response: {
        200: ArtistsReponseModel.GetArtistWithTrends,
        400: ErrorResponseModel.BadRequest,
        500: ErrorResponseModel.InternalServerError,
      },
      detail: {
        summary: 'Search artists (trend includes)',
      },
    }
  )
  .get(
    '/search/:id',
    async ({ params }) => {
      return await artistsService.getArtistByUserId(params.id);
    },
    {
      params: ArtistsParamsMode.GetArtistByUserId,
      response: {
        200: ArtistsReponseModel.GetArtistSingle,
        400: ErrorResponseModel.BadRequest,
        500: ErrorResponseModel.InternalServerError,
      },
      detail: {
        summary: 'Search single artist by twitter user id',
      },
    }
  )
  .get(
    '/search/username/:username',
    async ({ params }) => {
      return await artistsService.getArtistByUsername(params.username);
    },
    {
      params: ArtistsParamsMode.GetArtistByUsername,
      response: {
        200: ArtistsReponseModel.GetArtistSingle,
        400: ErrorResponseModel.BadRequest,
        500: ErrorResponseModel.InternalServerError,
      },
      detail: {
        summary: 'Search single artist by twitter user id',
      },
    }
  )
  .get(
    '/random',
    async () => {
      return await artistsService.getRandomArtist();
    },
    {
      response: {
        200: ArtistsReponseModel.GetArtistSingle,
        400: ErrorResponseModel.BadRequest,
        500: ErrorResponseModel.InternalServerError,
      },
      detail: {
        summary: 'Random artist',
      },
    }
  )
  // TODO: create authentication implementation
  .guard({}, app =>
    app
      .post(
        '/create',
        async ({ body }) => {
          if (!body) {
            return error(400, {
              status: StatusMap['Bad Request'],
              response: {
                error: 'Body error',
                message: 'None of all artist fields are provided',
              },
            });
          }

          const result = await artistsService.createArtist(body);

          if (!result) {
            return error(400, {
              status: StatusMap['Bad Request'],
              response: {
                error: 'Artist error',
                message: 'Artist with provided twitterUserId is alredy existing',
              },
            });
          }

          return result;
        },
        {
          // transform({ body }) {
          //   body.createdAt = new Date(body.createdAt);
          // },
          body: ArtistsBodyModel.CreateArtist,
          response: {
            200: ArtistsReponseModel.CreateArtist,
            400: ErrorResponseModel.BadRequest,
            500: ErrorResponseModel.InternalServerError,
          },
          detail: {
            summary: 'Create artist',
            hide: true,
          },
        }
      )
      .patch(
        '/edit/:id/',
        async ({ params, body }) => {
          if (!body) {
            return error(400, {
              status: StatusMap['Bad Request'],
              response: {
                error: 'Body error',
                message: 'None of any editable artist fields are provided',
              },
            });
          }

          const result = await artistsService.editArtist(params.id, body);

          if (!result) {
            return error(404, {
              status: StatusMap['Bad Request'],
              response: {
                error: 'Edit error',
                message: 'Unable to find artist profile with specified ID',
              },
            });
          }

          return result;
        },
        {
          body: ArtistsBodyModel.EditArtist,
          params: t.Object({ id: t.String() }),
          response: {
            200: ArtistsReponseModel.EditArtist,
            400: ErrorResponseModel.BadRequest,
            404: ErrorResponseModel.NotFound,
            500: ErrorResponseModel.InternalServerError,
          },
          detail: {
            summary: 'Edit artist',
            hide: true,
          },
        }
      )
      .patch(
        '/update/:id/',
        async ({ params, body }) => {
          if (!body) {
            return error(400, {
              status: StatusMap['Bad Request'],
              response: {
                error: 'Body error',
                message: 'None of any editable artist fields are provided',
              },
            });
          }

          const result = await artistsService.updateArtistInformation(params.id, body);

          if (!result) {
            return error(404, {
              status: StatusMap['Bad Request'],
              response: {
                error: 'Edit error',
                message: 'Unable to find artist profile with specified ID',
              },
            });
          }

          return result;
        },
        {
          body: ArtistsBodyModel.UpdateArtistInformations,
          params: t.Object({ id: t.String() }),
          response: {
            200: ArtistsReponseModel.UpdateArtistInformation,
            400: ErrorResponseModel.BadRequest,
            404: ErrorResponseModel.NotFound,
            500: ErrorResponseModel.InternalServerError,
          },
          detail: {
            summary: 'Update artist',
            hide: true,
          },
        }
      )
      .post(
        '/create/bulk',
        async ({ body }) => {
          if (!body) {
            return error(400, {
              status: StatusMap['Bad Request'],
              response: {
                error: 'Body error',
                message: 'None of all artist fields are provided',
              },
            });
          }

          const result = await artistsService.createArtistBulk(body);

          if (result.items.length === 0) {
            return error(400, {
              status: StatusMap['Bad Request'],
              response: {
                error: 'Artist error',
                message: 'Artist with provided twitterUserId is alredy existing',
              },
            });
          }

          return result;
        },
        {
          body: ArtistsBodyModel.CreateArtistBulk,
          response: {
            200: ArtistsReponseModel.CreateArtistBulk,
            400: ErrorResponseModel.BadRequest,
            500: ErrorResponseModel.InternalServerError,
          },
          detail: {
            summary: 'Bulk create artists',
            hide: true,
          },
        }
      )
  );

export default artistsRoutes;
