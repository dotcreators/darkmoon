import {
  EditArtistBody,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistRandomResponse,
  GetArtistResponse,
} from 'controllers/v2/artists/artists.schema';

export interface IDatabaseClient {
  getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse>;
  getRandomArtist(): Promise<GetArtistRandomResponse>;
  updateArtistStats(): Promise<{}>;
  updateArtistStatsBulk(): Promise<{}[]>;
  editArtist(
    id: string,
    body: EditArtistBody
  ): Promise<EditArtistResponse | null>;
  editArtistBulk(): Promise<{}[]>;
  createArtist(): Promise<{}>;
  createArtistBulk(): Promise<{}[]>;
}
