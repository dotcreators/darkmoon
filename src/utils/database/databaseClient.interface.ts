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

export interface IDatabaseClient {
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
