import { artists, artistsSuggestions, artistsTrends } from './schema/artists';
import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzleConfig } from './drizzle.config';
import { IDatabaseClient } from '../database-client.interface';
import { and, asc, count, desc, eq, gte, isNotNull, like, ne, sql, SQL } from 'drizzle-orm';
import {
  CreateArtistBody,
  CreateArtistBulkBody,
  CreateArtistBulkResponse,
  CreateArtistResponse,
  EditArtistBody,
  EditArtistBulkBody,
  EditArtistBulkResponse,
  EditArtistResponse,
  GetArtistByUserIdResponse,
  GetArtistQuery,
  GetArtistRandomResponse,
  GetArtistResponse,
  GetArtistWithTrendsResponse,
  UpdateArtistInformationBody,
  UpdateArtistInformationBulkBody,
  UpdateArtistInformationBulkResponse,
  UpdateArtistInformationResponse,
} from 'controllers/v2/artists/schemas/artists.types';
import { GetSuggestionsQuery, GetSuggestionsResponse } from 'controllers/v2/suggestions/schemas/suggestions.types';
import { GetTrendQuery, GetTrendsResponse } from 'controllers/v2/trends/schemas/trends.types';

export default class DrizzleClient implements IDatabaseClient {
  private client;

  constructor() {
    this.client = drizzle({
      connection: {
        connectionString: drizzleConfig.DATABASE_CONNECTION_URL,
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
      case 'tweets':
        filterOrderBy = desc(artists.tweetsCount);
        break;
      case 'new':
        filterOrderBy = desc(artists.createdAt);
        break;
      case 'trending':
        filterOptions.push(gte(artists.followersCount, 300));
        filterOptions.push(isNotNull(artists.weeklyFollowersTrend));
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

    filterOptions.push(ne(artists.isEnabled, false));

    const countResult = await this.client
      .select({ count: count() })
      .from(artists)
      .where(ne(artists.isEnabled, false))
      .execute();

    const totalItems = countResult[0]?.count || 0;

    const result = await this.client.query.artists.findMany({
      limit: query.perPage,
      offset: (query.page - 1) * query.perPage,
      orderBy: filterOrderBy,
      where: filterOptions.length > 0 ? and(...filterOptions) : undefined,
    });

    return {
      page: query.page,
      perPage: query.perPage,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / query.perPage),
      items: result,
    };
  }

  async getArtistWithTrendsPaginated(query: GetArtistQuery): Promise<GetArtistWithTrendsResponse> {
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

    filterOptions.push(ne(artists.isEnabled, false));

    const countResult = await this.client
      .select({ count: count() })
      .from(artists)
      .where(filterOptions.length > 0 ? and(...filterOptions) : undefined)
      .execute();

    const totalItems = countResult[0]?.count || 0;

    const artistsResult = await this.client
      .select()
      .from(artists)
      .where(filterOptions.length > 0 ? and(...filterOptions) : undefined)
      .orderBy(filterOrderBy)
      .limit(query.perPage)
      .offset((query.page - 1) * query.perPage)
      .execute();

    const artistIds = artistsResult.map(artist => artist.twitterUserId);

    const trendsResult = await this.client
      .select({
        id: artistsTrends.id,
        twitterUserId: artistsTrends.twitterUserId,
        tweetsCount: artistsTrends.tweetsCount,
        followersCount: artistsTrends.followersCount,
        createdAt: artistsTrends.createdAt,
        rowNumber:
          sql<number>`ROW_NUMBER() OVER (PARTITION BY ${artistsTrends.twitterUserId} ORDER BY ${artistsTrends.createdAt} DESC)`.as(
            'row_number'
          ),
      })
      .from(artistsTrends)
      .where(sql`${artistsTrends.twitterUserId} IN (${sql.join(artistIds, sql`, `)})`)
      .execute();

    const filteredTrends = trendsResult
      .filter(trend => trend.rowNumber <= 7)
      .map(trend => ({
        id: trend.id,
        twitterUserId: trend.twitterUserId,
        tweetsCount: trend.tweetsCount,
        followersCount: trend.followersCount,
        createdAt: trend.createdAt,
      }));

    const trendsByArtist = filteredTrends.reduce(
      (acc, trend) => {
        if (!acc[trend.twitterUserId]) {
          acc[trend.twitterUserId] = [];
        }
        acc[trend.twitterUserId].push(trend);
        return acc;
      },
      {} as Record<string, typeof filteredTrends>
    );

    const result = artistsResult.map(artist => ({
      artist,
      trends: trendsByArtist[artist.twitterUserId] || [],
    }));

    return {
      page: query.page,
      perPage: query.perPage,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / query.perPage),
      items: result,
    };
  }

  async getArtistByUserId(twitterUserId: string): Promise<GetArtistByUserIdResponse> {
    const r = await this.client.select().from(artists).where(eq(artists.twitterUserId, twitterUserId)).limit(1);
    return r[0];
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
    const r = await this.client
      .select()
      .from(artists)
      .orderBy(sql`RANDOM()`)
      .where(and(ne(artists.isEnabled, false), gte(artists.followersCount, 300)))
      .limit(1);
    return r[0];
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

    const countResult = await this.client.select({ count: count() }).from(artistsSuggestions).execute();

    const totalItems = countResult[0]?.count || 0;

    const result = await this.client.query.artistsSuggestions.findMany({
      limit: query.perPage,
      offset: (query.page - 1) * query.perPage,
      orderBy: filterOrderBy,
      where: filterOptions.length > 0 ? and(...filterOptions) : undefined,
    });

    return {
      page: query.page,
      perPage: query.perPage,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / query.perPage),
      items: result,
    };
  }

  async getTrendsPaginated(query: GetTrendQuery): Promise<GetTrendsResponse> {
    const countResult = await this.client
      .select({ count: count() })
      .from(artistsTrends)
      .where(eq(artistsTrends.twitterUserId, query.twitterUserId))
      .execute();

    const totalItems = countResult[0]?.count || 0;

    const result = await this.client
      .select()
      .from(artistsTrends)
      .where(eq(artistsTrends.twitterUserId, query.twitterUserId))
      .orderBy(desc(artistsTrends.createdAt))
      .limit(query.perPage)
      .offset((query.page - 1) * query.perPage)
      .execute();

    return {
      page: query.page,
      perPage: query.perPage,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / query.perPage),
      items: result.reverse(),
    };
  }
}
