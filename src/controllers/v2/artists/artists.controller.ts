import { Elysia, error, StatusMap, t } from 'elysia';

import { ErrorResponseModel } from '../error.schema';
import {
  ArtistsReponseModel,
  ArtistsQueryModel,
  ArtistsBodyModel,
} from './artists.schema';
import ArtistsService from './artists.service';

const artistsService = new ArtistsService();

const artistsRoutesV2 = new Elysia({
  prefix: '/artists',
  detail: {
    tags: ['v2'],
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
            message:
              'Maximum artists query must be greater than 0 and limited by 100',
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
    }
  )
  .get(
    '/random',
    async () => {
      return await artistsService.getRandomArtist();
    },
    {
      response: {
        200: ArtistsReponseModel.GetRandomArtist,
        400: ErrorResponseModel.BadRequest,
        500: ErrorResponseModel.InternalServerError,
      },
    }
  )
  .post(
    '/create',
    async ({ body }) => {
      // TODO: move to guard group after authentication is implemented

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
      transform({ body }) {
        body.createdAt = new Date(body.createdAt);
      },
      body: ArtistsBodyModel.CreateArtist,
      response: {
        200: ArtistsReponseModel.CreateArtist,
        400: ErrorResponseModel.BadRequest,
        500: ErrorResponseModel.InternalServerError,
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

      const result = await artistsService.updateArtistInformation(
        params.id,
        body
      );

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
    }
  );

export default artistsRoutesV2;
