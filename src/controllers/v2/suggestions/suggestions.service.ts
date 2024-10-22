import {
  IDatabaseClient,
  ISuggestionsDatabaseClient,
} from 'utils/database/databaseClient.interface';
import DrizzleClient from 'utils/database/drizzle/drizzleClient';
import {
  GetSuggestionsQuery,
  GetSuggestionsResponse,
} from './suggestions.schema';

export default class SuggestionsService {
  private client: ISuggestionsDatabaseClient;

  constructor() {
    this.client = new DrizzleClient();
  }

  async getSuggestionsPaginated(
    query: GetSuggestionsQuery
  ): Promise<GetSuggestionsResponse> {
    return {} as GetSuggestionsResponse;
  }
}
