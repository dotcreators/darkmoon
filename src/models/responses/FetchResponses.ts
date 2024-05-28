import { UnwrapSchema, t } from 'elysia';

export const fetchResponses = {
  'fetch.profile': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Object({
        avatar: t.String(),
        followers: t.Number(),
        tweets: t.Number(),
        images: t.Object({
          avatar: t.Nullable(t.String()),
          banner: t.Nullable(t.String()),
        }),
      }),
    },
    {
      description: 'Get parsed Twitter artist profile',
    }
  ),
};

export interface FetchResponsesModel {
  fetch: {
    profile: UnwrapSchema<(typeof fetchResponses)['fetch.profile']>;
  };
}
