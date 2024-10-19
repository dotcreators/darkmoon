import {
  EditArtistQuery,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistResponse,
} from 'controllers/v2/artists/artists.schema';
import { IDatabaseClient } from '../databaseClient.interface';

// ToDo: create pocketbase implementation
export default class PocketbaseClient implements IDatabaseClient {
  async getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse> {
    return {} as GetArtistResponse;
  }
  async updateArtistStats(): Promise<{}> {
    return {};
  }
  async updateArtistStatsBulk(): Promise<{}[]> {
    return [{}];
  }
  async getRandomArtist(): Promise<{}> {
    return {};
  }
  async editArtist(query: EditArtistQuery): Promise<EditArtistResponse> {
    return {} as EditArtistResponse;
  }
  async editArtistBulk(): Promise<{}[]> {
    return [{}];
  }
  async createArtist(): Promise<{}> {
    return {};
  }
  async createArtistBulk(): Promise<{}[]> {
    return [{}];
  }
}
