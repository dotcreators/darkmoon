import { UnwrapSchema, t } from 'elysia';

export const fetchResponses = {
  'fetch.profile': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Object({
        username: t.String(),
        name: t.MaybeEmpty(t.String()),
        followersCount: t.Number(),
        tweetsCount: t.Number(),
        images: t.Object({
          avatar: t.String(),
          banner: t.MaybeEmpty(t.String()),
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
