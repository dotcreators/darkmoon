import { t } from 'elysia';

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
