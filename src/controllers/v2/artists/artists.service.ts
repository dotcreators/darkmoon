import { IArtistsDatabaseClient } from 'utils/database/database-client.interface';
import DrizzleClient from 'utils/database/drizzle/drizzle-client';
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
} from './schemas/artists.types';

export default class ArtistsService {
  private databaseProvider: IArtistsDatabaseClient;

  constructor() {
    this.databaseProvider = new DrizzleClient();
  }

  async getArtistsPaginated(query: GetArtistQuery): Promise<GetArtistResponse> {
    return await this.databaseProvider.getArtistPaginated(query);
  }

  async editArtist(id: string, body: EditArtistBody): Promise<EditArtistResponse | null> {
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

  async createArtist(body: CreateArtistBody): Promise<CreateArtistResponse | null> {
    return await this.databaseProvider.createArtist(body);
  }

  async updateArtistInformationBulk(
    body: UpdateArtistInformationBulkBody
  ): Promise<UpdateArtistInformationBulkResponse> {
    return await this.databaseProvider.updateArtistInformationBulk(body);
  }

  async createArtistBulk(body: CreateArtistBulkBody): Promise<CreateArtistBulkResponse> {
    return await this.databaseProvider.createArtistBulk(body);
  }

  async editArtistBulk(body: EditArtistBulkBody): Promise<EditArtistBulkResponse> {
    return await this.databaseProvider.editArtistBulk(body);
  }
}
