import Elysia, { status, StatusMap } from 'elysia';
import { ErrorResponseModel } from '../schemas/error.schema';
import SuggestionsService from './suggestions.service';
import { SuggestionsQueryModel } from './schemas/suggestions.query';
import { SuggestionsResponseModel } from './schemas/suggestions.response';

const suggestionsService = new SuggestionsService();

const suggestionsRoutes = new Elysia({
  prefix: '/suggestions',
  detail: {
    tags: ['Suggestions'],
  },
}).get(
  '/search',
  async ({ query }) => {
    if (!Number.isInteger(query.perPage) || query.perPage > 100 || query.perPage < 1) {
      return status(400, {
        status: StatusMap['Bad Request'],
        response: {
          error: 'Query error',
          message: 'Maximum suggestions query must be greater than 0 and limited by 100',
        },
      });
    } else if (!Number.isInteger(query.page) || query.page < 1) {
      return status(400, {
        status: StatusMap['Bad Request'],
        response: {
          error: 'Query error',
          message: 'Page value must be greater than 0',
        },
      });
    }

    return await suggestionsService.getSuggestionsPaginated(query);
  },
  {
    query: SuggestionsQueryModel.GetSuggestions,
    response: {
      200: SuggestionsResponseModel.GetSuggestions,
      400: ErrorResponseModel.BadRequest,
      500: ErrorResponseModel.InternalServerError,
    },
    detail: {
      summary: 'Search artist suggestions',
    },
  }
);

export default suggestionsRoutes;
