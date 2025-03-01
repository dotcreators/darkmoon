import { ArtistSuggestionModel } from 'controllers/v2/schemas/shared.schema';
import { t } from 'elysia';

export const SuggestionsResponseModel = {
  GetSuggestions: t.Object(
    {
      page: t.Number(),
      perPage: t.Number(),
      totalPages: t.Number(),
      totalItems: t.Number(),
      items: t.Array(ArtistSuggestionModel, { minItems: 0 }),
    },
    { description: 'Returns paginated artist suggestions' }
  ),
};
