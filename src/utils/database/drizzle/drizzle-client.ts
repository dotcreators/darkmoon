import { artists, artistsSuggestions, artistsTrends } from './schema/artists';
import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzleConfig } from './drizzle.config';
import { IDatabaseClient } from '../database-client.interface';
import { and, asc, count, desc, eq, gte, like, sql, SQL } from 'drizzle-orm';
import { GetSuggestionsQuery, GetSuggestionsResponse } from 'controllers/v2/suggestions/suggestions.schema';
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
} from 'controllers/v2/artists/schemas/artists.types';

export default class DrizzleClient implements IDatabaseClient {
  private client;

  constructor() {
    this.client = drizzle({
      connection: {
        connectionString: drizzleConfig.DATABASE_CONNECTION_URL,
        ssl: true,
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
      filterOptions.push(and(...query.tags.map(tag => sql`tags->'items' @> ${JSON.stringify([tag])}`))!);
    }

    const items = await this.client.select({ count: count(artists.id) }).from(artists);

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

  async editArtist(id: string, body: EditArtistBody): Promise<EditArtistResponse | null> {
    const result = await this.client
      .update(artists)
      .set({
        ...body,
      })
      .where(eq(artists.twitterUserId, id))
      .returning();

    return result.length !== 1 ? null : result[0];
  }

  async getRandomArtist(): Promise<GetArtistRandomResponse> {
    const result = await this.client
      .select()
      .from(artists)
      .orderBy(sql`RANDOM()`)
      .limit(1);
    return result[0];
  }

  async updateArtistInformation(
    id: string,
    body: UpdateArtistInformationBody
  ): Promise<UpdateArtistInformationResponse> {
    const result = await this.client
      .update(artists)
      .set({ ...body })
      .where(eq(artists.twitterUserId, id))
      .returning();
    return result[0];
  }

  async createArtist(body: CreateArtistBody): Promise<CreateArtistResponse | null> {
    const result = await this.client
      .insert(artists)
      .values({
        ...body,
        joinedAt: new Date(),
        updatedAt: new Date(),
        url: `https://x.com/${body.username}`,
        weeklyTweetsTrend: 0,
        weeklyFollowersTrend: 0,
      })
      .onConflictDoNothing()
      .returning();

    if (result.length < 0) {
      return null;
    }

    return result[0];
  }

  async updateArtistInformationBulk(
    body: UpdateArtistInformationBulkBody
  ): Promise<UpdateArtistInformationBulkResponse> {
    const promises = body.map(profile => {
      return this.client
        .update(artists)
        .set({ ...profile.data })
        .where(eq(artists.id, profile.id))
        .returning()._.result[0];
    });

    const results = await Promise.allSettled(promises);

    let errorResults: { id: string; reason: string }[] = [];
    const processedResults = results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          errorResults.push({ id: body[index].id, reason: result.reason });
          return null;
        }
      })
      .filter(result => result !== null);

    return { items: processedResults, errors: errorResults };
  }

  async editArtistBulk(body: EditArtistBulkBody): Promise<EditArtistBulkResponse> {
    const promises = body.map(profile => {
      return this.client
        .update(artists)
        .set({ ...profile.data })
        .where(eq(artists.id, profile.id))
        .returning()._.result[0];
    });

    const results = await Promise.allSettled(promises);

    let errorResults: { id: string; reason: string }[] = [];
    const processedResults = results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          errorResults.push({ id: body[index].id, reason: result.reason });
          return null;
        }
      })
      .filter(result => result !== null);

    return { items: processedResults, errors: errorResults };
  }

  async createArtistBulk(body: CreateArtistBulkBody): Promise<CreateArtistBulkResponse> {
    const promises = body.map(profile => {
      return this.client
        .insert(artists)
        .values({ ...profile, url: `https://x.com/${profile.username}` })
        .returning()._.result[0];
    });

    const results = await Promise.allSettled(promises);

    let errorResults: { id: string; reason: string }[] = [];
    const processedResults = results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          errorResults.push({
            id: body[index].twitterUserId,
            reason: result.reason,
          });
          return null;
        }
      })
      .filter(result => result !== null);

    return { items: processedResults, errors: errorResults };
  }

  async getSuggestionsPaginated(query: GetSuggestionsQuery): Promise<GetSuggestionsResponse> {
    let filterOptions: SQL[] = [];
    let filterOrderBy: SQL;

    switch (query.sortBy) {
      case 'username':
        filterOrderBy = asc(artistsSuggestions.username);
        break;
      case 'createdAt':
        filterOrderBy = desc(artistsSuggestions.createdAt);
        break;
      case 'status':
        filterOrderBy = desc(artistsSuggestions.status);
        break;
      default:
        filterOrderBy = asc(artistsSuggestions.status);
        break;
    }

    if (query.username) {
      filterOptions.push(like(artistsSuggestions.username, `%${query.username}%`));
    }
    if (query.status) {
      filterOptions.push(eq(artistsSuggestions.status, query.status));
    }
    if (query.tags && query.tags.length > 0) {
      filterOptions.push(and(...query.tags.map(tag => sql`tags->'items' @> ${JSON.stringify([tag])}`))!);
    }

    const items = await this.client.select({ count: count(artistsSuggestions.id) }).from(artistsSuggestions);

    const result = await this.client.query.artistsSuggestions.findMany({
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
}
