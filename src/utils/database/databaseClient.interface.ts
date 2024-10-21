import {
  CreateArtistBody,
  CreateArtistResponse,
  EditArtistBody,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistRandomResponse,
  GetArtistResponse,
  UpdateArtistInformationBody,
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
  editArtistBulk(): Promise<{}[]>;
  updateArtistStatsBulk(): Promise<{}[]>;
  createArtistBulk(): Promise<{}[]>;
}
