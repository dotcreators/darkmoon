import { t } from 'elysia';

export const suggestionsResponses = {
  'suggestions.get': t.Object({
    status: t.String({ default: 'success' }),
    response: t.Object({
      data: t.Array(
        t.Object({
          requestId: t.String(),
          username: t.String(),
          country: t.Nullable(t.String()),
          tags: t.Nullable(t.Array(t.String(), { minItems: 0 })),
          requestStatus: t.String(),
          avatarUrl: t.String(),
          createdAt: t.Date(),
        }),
        { minItems: 0 }
      ),
      has_next: t.Boolean(),
    }),
  }),
  'suggestions.create': t.Object({
    status: t.String(),
    response: t.String(),
  }),
  'suggestions.createBulk': t.Object({}),
  'suggestions.update': t.Object({}),
};

export interface SuggestionsResponsesModel {
  suggestions: {
    create: {};
    createBulk: {};
    get: {};
    update: {};
  };
}
