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

  async getRandomArtist(): Promise<GetArtistRandomResponse> {
    return await this.databaseProvider.getRandomArtist();
  }

  async updateArtistInformation(
    id: string,
    body: UpdateArtistInformationBody
  ): Promise<UpdateArtistInformationResponse> {
    return await this.databaseProvider.updateArtistInformation(id, body);
  }

  async createArtist(
    body: CreateArtistBody
  ): Promise<CreateArtistResponse | null> {
    return await this.databaseProvider.createArtist(body);
  }

  async updateArtistStatsBulk() {}

  async createArtistBulk() {}

  async editArtistBulk() {}
}
