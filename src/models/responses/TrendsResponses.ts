import { UnwrapSchema, t } from 'elysia';

export const trendsResponses = {
  'trends.get': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Object({
        followersCount: t.Number(),
        tweetsCount: t.Number(),
        recordedAt: t.Date(),
      }),
    },
    {
      description: 'Get artists followers and tweets trends',
    }
  ),
};

export interface TrendsResponsesModel {
  artists: {
    get: UnwrapSchema<(typeof trendsResponses)['trends.get']>;
  };
}
