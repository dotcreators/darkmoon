import { UnwrapSchema, t } from 'elysia';

export const errorResponses = {
  'api.error': t.Object(
    {
      status: t.String({ default: 'error' }),
      response: t.String(),
    },
    {
      description: 'API Error',
    }
  ),
  'api.badrequest': t.Object(
    {
      status: t.String({ default: 'error' }),
      response: t.String(),
    },
    {
      description: 'Bad request',
    }
  ),
};

export interface ErrorResponsesModel {
  api: {
    error: UnwrapSchema<(typeof errorResponses)['api.error']>;
    badrequest: UnwrapSchema<(typeof errorResponses)['api.badrequest']>;
  };
}
