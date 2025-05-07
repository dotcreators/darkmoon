import {
  CreateArtistBody,
  CreateArtistBulkBody,
  CreateArtistBulkResponse,
  CreateArtistResponse,
  EditArtistBody,
  EditArtistBulkBody,
  EditArtistBulkResponse,
  EditArtistResponse,
  GetArtistByUserIdResponse,
  GetArtistQuery,
  GetArtistRandomResponse,
  GetArtistResponse,
  GetArtistWithTrendsResponse,
  UpdateArtistInformationBody,
  UpdateArtistInformationBulkBody,
  UpdateArtistInformationBulkResponse,
  UpdateArtistInformationResponse,
} from 'controllers/v2/artists/schemas/artists.types';
import { GetSuggestionsQuery, GetSuggestionsResponse } from 'controllers/v2/suggestions/schemas/suggestions.types';
import { GetTrendQuery, GetTrendsResponse } from 'controllers/v2/trends/schemas/trends.types';

export interface IDatabaseClient extends IArtistsDatabaseClient, ISuggestionsDatabaseClient, ITrendsDatabaseClient {}

export interface IArtistsDatabaseClient {
  getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse>;
  getArtistWithTrendsPaginated(query: GetArtistQuery): Promise<GetArtistWithTrendsResponse>;
  createArtist(body: CreateArtistBody): Promise<CreateArtistResponse | null>;
  updateArtistInformation(id: string, body: UpdateArtistInformationBody): Promise<UpdateArtistInformationResponse>;
  editArtist(id: string, body: EditArtistBody): Promise<EditArtistResponse | null>;
  getRandomArtist(): Promise<GetArtistRandomResponse>;
  getArtistByUserId(twitterUserId: string): Promise<GetArtistByUserIdResponse>;
  editArtistBulk(body: EditArtistBulkBody): Promise<EditArtistBulkResponse>;
  updateArtistInformationBulk(body: UpdateArtistInformationBulkBody): Promise<UpdateArtistInformationBulkResponse>;
  createArtistBulk(body: CreateArtistBulkBody): Promise<CreateArtistBulkResponse>;
}

export interface ISuggestionsDatabaseClient {
  getSuggestionsPaginated(query: GetSuggestionsQuery): Promise<GetSuggestionsResponse>;
}

export interface ITrendsDatabaseClient {
  getTrendsPaginated(query: GetTrendQuery): Promise<GetTrendsResponse>;
}
