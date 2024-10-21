import {
  EditArtistBody,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistResponse,
} from './artists.schema';
import { IDatabaseClient } from 'utils/database/databaseClient.interface';
import DrizzleClient from 'utils/database/drizzle/drizzleClient';

export default class ArtistsService {
  private databaseProvider: IDatabaseClient;

  constructor() {
    this.databaseProvider = new DrizzleClient();
  }

  async getArtistsPaginated(query: GetArtistQuery): Promise<GetArtistResponse> {
    return await this.databaseProvider.getArtistPaginated(query);
  }

  async editArtist(
    id: string,
    body: EditArtistBody
  ): Promise<EditArtistResponse | null> {
    return await this.databaseProvider.editArtist(id, body);
  }

  getRandomArtist() {}
  updateArtistStats() {}
  updateArtistStatsBulk() {}
  createArtist() {}
  createArtistBulk() {}
  editArtistBulk() {}
}
