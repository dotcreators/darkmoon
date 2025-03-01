import { ISuggestionsDatabaseClient } from 'utils/database/database-client.interface';
import DrizzleClient from 'utils/database/drizzle/drizzle-client';
import { GetSuggestionsQuery, GetSuggestionsResponse } from './schemas/suggestions.types';

export default class SuggestionsService {
  private client: ISuggestionsDatabaseClient;

  constructor() {
    this.client = new DrizzleClient();
  }

  async getSuggestionsPaginated(query: GetSuggestionsQuery): Promise<GetSuggestionsResponse> {
    return await this.client.getSuggestionsPaginated(query);
  }
}
