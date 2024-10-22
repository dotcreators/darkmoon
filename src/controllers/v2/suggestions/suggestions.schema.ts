import { Static, t } from 'elysia';
import { ArtistSuggestionModel } from '../shared.schema';

export const SuggestionsQueryModel = {
  GetSuggestions: t.Object({
    page: t.Number(),
    perPage: t.Number(),
    status: t.Optional(t.String()),
    tags: t.Optional(t.Array(t.String(), { minItems: 1 })),
    username: t.Optional(t.String()),
    sortBy: t.Optional(t.String()),
  }),
};

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

export type GetSuggestionsQuery = Static<
  typeof SuggestionsQueryModel.GetSuggestions
>;
export type GetSuggestionsResponse = Static<
  typeof SuggestionsResponseModel.GetSuggestions
>;
