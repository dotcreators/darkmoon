import {
  EditArtistBody,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistResponse,
  GetArtistUsernamesResponse,
} from 'controllers/v2/artists/artists.schema';

export interface IDatabaseClient {
  getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse>;
  getArtistsUsernames(): Promise<GetArtistUsernamesResponse>;
  getRandomArtist(): Promise<{}>;
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
