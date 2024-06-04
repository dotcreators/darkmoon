import { UnwrapSchema, t } from 'elysia';

export const suggestionsResponses = {
  'suggestions.get': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Object({
        data: t.Array(
          t.Object({
            requestId: t.String(),
            username: t.String(),
            country: t.Optional(t.String()),
            tags: t.Optional(t.Array(t.String(), { minItems: 0 })),
            requestStatus: t.String(),
            avatarUrl: t.String(),
            createdAt: t.Date(),
          }),
          { minItems: 0 }
        ),
        has_next: t.Boolean(),
      }),
    },
    {
      description: 'Get paginated artists suggestions',
    }
  ),
  'suggestions.create': t.Object(
    {
      status: t.String(),
      response: t.String(),
    },
    {
      description: 'Create artist suggestion',
    }
  ),
  'suggestions.update': t.Object(
    {
      status: t.String(),
      response: t.String(),
    },
    {
      description: 'Update artist suggestion status',
    }
  ),
};

export interface SuggestionsResponsesModel {
  artists: {
    create: UnwrapSchema<(typeof suggestionsResponses)['suggestions.create']>;
    get: UnwrapSchema<(typeof suggestionsResponses)['suggestions.get']>;
    update: UnwrapSchema<(typeof suggestionsResponses)['suggestions.update']>;
  };
}
