import * as artistsSchema from './schema/artists';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzleConfig } from './drizzle.config';
import { IDatabaseClient } from '../databaseClient.interface';
import {
  EditArtistQuery,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistResponse,
} from 'controllers/v2/artists/artists.schema';
import { and, asc, desc, eq, gte, like, or, sql, SQL } from 'drizzle-orm';
import { envConfig } from 'env.config';

export default class DrizzleClient implements IDatabaseClient {
  private client;

  constructor() {
    this.client = drizzle({
      connection: {
        connectionString: drizzleConfig.DATABASE_CONNECTION_URL,
        ssl: envConfig.IS_DEVELOPMENT ? false : true,
      },
      schema: artistsSchema,
    });
  }

  async getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse> {
    let filterOptions: SQL[] = [];
    let filterOrderBy: SQL;

    switch (query.sortBy) {
      case 'username':
        filterOrderBy = asc(artistsSchema.artists.username);
        break;
      case 'followers':
        filterOrderBy = desc(artistsSchema.artists.followersCount);
        break;
      case 'posts':
        filterOrderBy = desc(artistsSchema.artists.tweetsCount);
        break;
      case 'new':
        filterOrderBy = desc(artistsSchema.artists.createdAt);
        break;
      case 'trending':
        filterOptions.push(gte(artistsSchema.artists.followersCount, 300));
        filterOrderBy = desc(artistsSchema.artists.weeklyFollowersTrend);
        break;
      default:
        filterOrderBy = asc(artistsSchema.artists.followersCount);
        break;
    }

    if (query.username) {
      filterOptions.push(
        like(artistsSchema.artists.username, `%${query.username}%`)
      );
    }
    if (query.country) {
      filterOptions.push(eq(artistsSchema.artists.country, query.country));
    }
    if (query.tags && query.tags.length > 0) {
      filterOptions.push(
        or(...query.tags.map(tag => sql`tags->'items' @> ${tag}`))!
      );
    }

    const result = await this.client.query.artists.findMany({
      limit: query.perPage,
      offset: query.page * query.perPage,
      orderBy: filterOrderBy,
      where: filterOptions.length > 0 ? and(...filterOptions) : undefined,
    });

    return {
      page: query.page,
      perPage: query.perPage,
      totalPages: 1,
      totalItems: result.length,
      items: result,
    };
  }
  async editArtist(
    id: string,
    query: EditArtistQuery
  ): Promise<EditArtistResponse | null> {
    return {} as EditArtistResponse;
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
