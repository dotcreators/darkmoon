import { ArtistTrendModel } from 'controllers/v2/schemas/shared.schema';
import { t } from 'elysia';

export const TrendsResponseModel = {
  GetTrend: t.Object({
    page: t.Number(),
    perPage: t.Number(),
    totalPages: t.Number(),
    totalItems: t.Number(),
    items: t.Array(ArtistTrendModel, { minItems: 0 }),
  }),
};
