import { ITrendsDatabaseClient } from 'utils/database/database-client.interface';
import { GetTrendQuery, GetTrendsResponse } from './schemas/trends.types';
import DrizzleClient from 'utils/database/drizzle/drizzle-client';

export default class TrendsService {
  private databaseProvider: ITrendsDatabaseClient;

  constructor() {
    this.databaseProvider = new DrizzleClient();
  }

  async getTrendsPaginated(query: GetTrendQuery): Promise<GetTrendsResponse> {
    return await this.databaseProvider.getTrendsPaginated(query);
  }
}
