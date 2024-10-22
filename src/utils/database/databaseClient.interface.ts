import {
  CreateArtistBody,
  CreateArtistBulkBody,
  CreateArtistBulkResponse,
  CreateArtistResponse,
  EditArtistBody,
  EditArtistBulkBody,
  EditArtistBulkResponse,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistRandomResponse,
  GetArtistResponse,
  UpdateArtistInformationBody,
  UpdateArtistInformationBulkBody,
  UpdateArtistInformationBulkResponse,
  UpdateArtistInformationResponse,
} from 'controllers/v2/artists/artists.schema';
import {
  GetSuggestionsQuery,
  GetSuggestionsResponse,
} from 'controllers/v2/suggestions/suggestions.schema';

export interface IDatabaseClient
  extends IArtistsDatabaseClient,
    ISuggestionsDatabaseClient {}

export interface IArtistsDatabaseClient {
  getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse>;
  createArtist(body: CreateArtistBody): Promise<CreateArtistResponse | null>;
  updateArtistInformation(
    id: string,
    body: UpdateArtistInformationBody
  ): Promise<UpdateArtistInformationResponse>;
  editArtist(
    id: string,
    body: EditArtistBody
  ): Promise<EditArtistResponse | null>;
  getRandomArtist(): Promise<GetArtistRandomResponse>;
  editArtistBulk(body: EditArtistBulkBody): Promise<EditArtistBulkResponse>;
  updateArtistInformationBulk(
    body: UpdateArtistInformationBulkBody
  ): Promise<UpdateArtistInformationBulkResponse>;
  createArtistBulk(
    body: CreateArtistBulkBody
  ): Promise<CreateArtistBulkResponse>;
}

export interface ISuggestionsDatabaseClient {
  getSuggestionsPaginated(
    query: GetSuggestionsQuery
  ): Promise<GetSuggestionsResponse>;
}
