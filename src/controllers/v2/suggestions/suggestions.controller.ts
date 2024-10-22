import Elysia, { error, StatusMap } from 'elysia';
import {
  SuggestionsQueryModel,
  SuggestionsResponseModel,
} from './suggestions.schema';
import { ErrorResponseModel } from '../error.schema';
import SuggestionsService from './suggestions.service';

const suggestionsService = new SuggestionsService();

const suggestionsRoutes = new Elysia({
  prefix: '/suggestions',
  detail: {
    tags: ['v2'],
  },
}).get(
  '/search',
  async ({ query }) => {
    if (query.perPage > 100 || query.perPage < 0) {
      return error(400, {
        status: StatusMap['Bad Request'],
        response: {
          error: 'Query error',
          message:
            'Maximum suggestions query must be greater than 0 and limited by 100',
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

    return await suggestionsService.getSuggestionsPaginated(query);
  },
  {
    query: SuggestionsQueryModel.GetSuggestions,
    response: {
      200: SuggestionsResponseModel.GetSuggestions,
      400: ErrorResponseModel.BadRequest,
      500: ErrorResponseModel.InternalServerError,
    },
  }
);

export default suggestionsRoutes;
