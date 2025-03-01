import { t } from 'elysia';

export const TrendsQueryModel = {
  GetTrend: t.Object({
    twitterUserId: t.String(),
    page: t.Number(),
    perPage: t.Number({ enum: [7, 14, 31, 93, 186, 372] }),
  }),
};
