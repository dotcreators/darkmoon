import Elysia, { error, StatusMap } from 'elysia';
import TrendsService from './trends.service';
import { TrendsQueryModel } from './schemas/trends.query';
import { ErrorResponseModel } from '../schemas/error.schema';
import { TrendsResponseModel } from './schemas/trends.response';

const trendsService = new TrendsService();

const trendsRoutes = new Elysia({
  prefix: '/trends',
  detail: {
    tags: ['v2'],
  },
}).get(
  '/search',
  async ({ query }) => {
    if (query.perPage > 372 || query.perPage < 0) {
      return error(400, {
        status: StatusMap['Bad Request'],
        response: {
          error: 'Query error',
          message: 'Maximum artist trends query must be greater than 0 and limited by 372',
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

    return await trendsService.getTrendsPaginated(query);
  },
  {
    transform({ query }) {},
    query: TrendsQueryModel.GetTrend,
    response: {
      200: TrendsResponseModel.GetTrend,
      400: ErrorResponseModel.BadRequest,
      500: ErrorResponseModel.InternalServerError,
    },
  }
);

export default trendsRoutes;
