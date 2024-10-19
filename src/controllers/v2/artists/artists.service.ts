import PocketbaseClient from 'utils/database/pocketbase/PocketbaseClient';
import {
  EditArtistQuery,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistResponse,
} from './artists.schema';
import { IDatabaseClient } from 'utils/database/databaseClient.interface';

export default class ArtistsService {
  private databaseProvider: IDatabaseClient;

  constructor(databaseProvider: IDatabaseClient = new PocketbaseClient()) {
    this.databaseProvider = databaseProvider;
  }

  async getArtistsPaginated(query: GetArtistQuery): Promise<GetArtistResponse> {
    return await this.databaseProvider.getArtistPaginated(query);
  }

  async editArtist(query: EditArtistQuery): Promise<EditArtistResponse> {
    return await this.databaseProvider.editArtist(query);
  }

  getRandomArtist() {}
  updateArtistStats() {}
  updateArtistStatsBulk() {}
  createArtist() {}
  createArtistBulk() {}
  editArtistBulk() {}
}
