import {
  EditArtistQuery,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistResponse,
} from 'controllers/v2/artists/artists.schema';
import { IDatabaseClient } from '../databaseClient.interface';
import PocketBase from 'pocketbase';
import { pocketbaseConfig } from './pocketbase.config';

export default class PocketbaseClient implements IDatabaseClient {
  private pbClient: PocketBase;

  constructor() {
    this.pbClient = new PocketBase(pocketbaseConfig.POCKETBASE_CONNECTION_URL);
  }

  async getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse> {
    let filterOptions: string[] = [];
    let filterSortBy: { field: string; order: '-' | '+' } = {
      field: 'followersCount',
      order: '-',
    };

    switch (query.sortBy) {
      case 'username':
        filterSortBy = { field: 'username', order: '+' };
        break;
      case 'followers':
        filterSortBy = { field: 'followersCount', order: '-' };
        break;
      case 'posts':
        filterSortBy = { field: 'tweetsCount', order: '-' };
        break;
      case 'new':
        filterSortBy = { field: 'created', order: '-' };
        break;
      case 'trending':
        filterOptions.push(`followersCount>=300`);
        filterSortBy = { field: 'weeklyFollowersTrend', order: '-' };
        break;
    }

    if (query.username) {
      filterOptions.push(`username~'${query.username}'`);
    }
    if (query.country) {
      filterOptions.push(`country='${query.country}'`);
    }
    if (query.tags && query.tags.length > 0) {
      filterOptions.push(query.tags.map(tag => `tags~'${tag}'`).join(' || '));
    }

    return await this.pbClient
      .collection('artists')
      .getList(query.page, query.perPage, {
        filter: filterOptions.join(' && '),
        sort: `${filterSortBy.order}${filterSortBy.field}`,
      });
  }

  async editArtist(
    id: string,
    query: EditArtistQuery
  ): Promise<EditArtistResponse | null> {
    const r: EditArtistResponse = await this.pbClient
      .collection('artists')
      .update(id, query);

    console.log(r);

    if (!r) {
      return null;
    }

    return r;
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
