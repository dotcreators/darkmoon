import {
  EditArtistQuery,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistResponse,
} from 'controllers/v2/artists/artists.schema';

export interface IDatabaseClient {
  getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse>;
  getRandomArtist(): Promise<{}>;
  updateArtistStats(): Promise<{}>;
  updateArtistStatsBulk(): Promise<{}[]>;
  editArtist(
    id: string,
    query: EditArtistQuery
  ): Promise<EditArtistResponse | null>;
  editArtistBulk(): Promise<{}[]>;
  createArtist(): Promise<{}>;
  createArtistBulk(): Promise<{}[]>;
}
