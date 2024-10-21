import { artists, artistsSuggestions, artistsTrends } from './schema/artists';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzleConfig } from './drizzle.config';
import { IDatabaseClient } from '../databaseClient.interface';
import {
  EditArtistBody,
  EditArtistResponse,
  GetArtistQuery,
  GetArtistResponse,
} from 'controllers/v2/artists/artists.schema';
import { and, asc, count, desc, eq, gte, like, sql, SQL } from 'drizzle-orm';
import { envConfig } from 'env.config';

export default class DrizzleClient implements IDatabaseClient {
  private client;

  constructor() {
    this.client = drizzle({
      connection: {
        connectionString: drizzleConfig.DATABASE_CONNECTION_URL,
        ssl: envConfig.IS_DEVELOPMENT ? false : true,
      },
      schema: { artists, artistsSuggestions, artistsTrends },
    });
  }

  async getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse> {
    let filterOptions: SQL[] = [];
    let filterOrderBy: SQL;

    switch (query.sortBy) {
      case 'username':
        filterOrderBy = asc(artists.username);
        break;
      case 'followers':
        filterOrderBy = desc(artists.followersCount);
        break;
      case 'posts':
        filterOrderBy = desc(artists.tweetsCount);
        break;
      case 'new':
        filterOrderBy = desc(artists.createdAt);
        break;
      case 'trending':
        filterOptions.push(gte(artists.followersCount, 300));
        filterOrderBy = desc(artists.weeklyFollowersTrend);
        break;
      default:
        filterOrderBy = asc(artists.followersCount);
        break;
    }

    if (query.username) {
      filterOptions.push(like(artists.username, `%${query.username}%`));
    }
    if (query.country) {
      filterOptions.push(eq(artists.country, query.country));
    }
    if (query.tags && query.tags.length > 0) {
      filterOptions.push(
        and(
          ...query.tags.map(
            tag => sql`tags->'items' @> ${JSON.stringify([tag])}`
          )
        )!
      );
    }

    const items = await this.client
      .select({ count: count(artists.id) })
      .from(artists);

    const result = await this.client.query.artists.findMany({
      limit: query.perPage,
      offset: (query.page - 1) * query.perPage,
      orderBy: filterOrderBy,
      where: filterOptions.length > 0 ? and(...filterOptions) : undefined,
    });

    return {
      page: query.page,
      perPage: query.perPage,
      totalPages: Math.ceil(items.length / query.perPage),
      totalItems: result.length,
      items: result,
    };
  }
  async editArtist(
    id: string,
    body: EditArtistBody
  ): Promise<EditArtistResponse | null> {
    const result = await this.client
      .update(artists)
      .set({
        username: body.username,
        name: body.name,
        tags: body.tags,
        country: body.country,
        images: body.images,
        bio: body.bio,
        url: body.url,
      })
      .where(eq(artists.twitterUserId, id))
      .returning();

    console.log(result);

    return result.length !== 1 ? null : result[0];
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
