import PocketbaseClient from 'utils/database/pocketbase/pocketbaseClient';
import {
  EditArtistQuery,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistResponse,
} from './artists.schema';
import { IDatabaseClient } from 'utils/database/databaseClient.interface';

export default class ArtistsService {
  private databaseProvider: IDatabaseClient;

  constructor() {
    this.databaseProvider = new PocketbaseClient();
  }

  async getArtistsPaginated(query: GetArtistQuery): Promise<GetArtistResponse> {
    return await this.databaseProvider.getArtistPaginated(query);
  }

  async editArtist(
    id: string,
    query: EditArtistQuery
  ): Promise<EditArtistResponse | null> {
    return await this.databaseProvider.editArtist(id, query);
  }

  getRandomArtist() {}
  updateArtistStats() {}
  updateArtistStatsBulk() {}
  createArtist() {}
  createArtistBulk() {}
  editArtistBulk() {}
}
