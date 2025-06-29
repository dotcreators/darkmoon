import { Static } from 'elysia';
import { TrendsQueryModel } from './trends.query';
import { TrendsResponseModel } from './trends.response';

export type GetTrendQuery = Static<typeof TrendsQueryModel.GetTrend>;
export type GetTrendsResponse = Static<typeof TrendsResponseModel.GetTrend>;
