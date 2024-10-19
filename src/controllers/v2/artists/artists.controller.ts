import { Elysia, error, StatusMap, t } from 'elysia';

import { ErrorResponseModel } from '../error.schema';
import { ArtistsReponseModel, ArtistsQueryModel } from './artists.schema';
import ArtistsService from './artists.service';

const artistsService = new ArtistsService();

const artistsRoutesV2 = new Elysia({
  prefix: '/artists',
  detail: {
    tags: ['Artists'],
  },
}).get(
  '/',
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
);

export default artistsRoutesV2;
