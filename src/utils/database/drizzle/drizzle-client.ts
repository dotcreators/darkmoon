import { artists, artistsSuggestions, artistsTrends } from './schema/artists';
import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzleConfig } from './drizzle.config';
import { IDatabaseClient } from '../database-client.interface';
import {
  and,
  arrayContains,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  lte,
  ne,
  or,
  sql,
  SQL,
} from 'drizzle-orm';
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
  GetArtistByUsernameResponse,
  GetArtistQuery,
  GetArtistRandomResponse,
  GetArtistResponse,
  GetArtistUsernamesResponse,
  GetArtistWithTrendsResponse,
  UpdateArtistInformationBody,
  UpdateArtistInformationBulkBody,
  UpdateArtistInformationBulkResponse,
  UpdateArtistInformationResponse,
} from 'controllers/v2/artists/schemas/artists.types';
import { GetSuggestionsQuery, GetSuggestionsResponse } from 'controllers/v2/suggestions/schemas/suggestions.types';
import { GetTrendQuery, GetTrendsResponse } from 'controllers/v2/trends/schemas/trends.types';

const getErrorReason = (reason: unknown): string => {
  const error = reason instanceof Error && reason.cause instanceof Error ? reason.cause : reason;
  return error instanceof Error ? error.message : String(error);
};

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

  private buildArtistFilters(query: GetArtistQuery): { filterOptions: SQL[]; filterOrderBy: SQL } {
    const filterOptions: SQL[] = [];
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
      const sanitizedUsername = query.username.trim();
      filterOptions.push(
        or(ilike(artists.username, `%${sanitizedUsername}%`)!, ilike(artists.name, `%${sanitizedUsername}%`))!
      );
    }
    if (query.country) {
      filterOptions.push(eq(artists.country, query.country.toLocaleLowerCase()));
    }
    if (query.tags && query.tags.length !== 0) {
      filterOptions.push(arrayContains(artists.tags, query.tags));
    }

    filterOptions.push(ne(artists.isEnabled, false));

    return { filterOptions, filterOrderBy };
  }

  async getArtistPaginated(query: GetArtistQuery): Promise<GetArtistResponse> {
    const { filterOptions, filterOrderBy } = this.buildArtistFilters(query);

    const countResult = await this.client
      .select({ count: count() })
      .from(artists)
      .where(filterOptions.length > 0 ? and(...filterOptions) : undefined)
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
      totalPages: totalItems === 0 ? 1 : Math.ceil(totalItems / query.perPage),
      items: result,
    };
  }

  async getArtistWithTrendsPaginated(query: GetArtistQuery): Promise<GetArtistWithTrendsResponse> {
    const { filterOptions, filterOrderBy } = this.buildArtistFilters(query);

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

    const filteredTrends = artistIds.length === 0 ? [] : await this.getLatestTrendsByArtistIds(artistIds, 7);

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
      totalPages: totalItems === 0 ? 1 : Math.ceil(totalItems / query.perPage),
      items: result,
    };
  }

  private async getLatestTrendsByArtistIds(artistIds: string[], limit: number) {
    const rankedTrends = this.client
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
      .where(inArray(artistsTrends.twitterUserId, artistIds))
      .as('ranked_trends');

    return await this.client
      .select({
        id: rankedTrends.id,
        twitterUserId: rankedTrends.twitterUserId,
        tweetsCount: rankedTrends.tweetsCount,
        followersCount: rankedTrends.followersCount,
        createdAt: rankedTrends.createdAt,
      })
      .from(rankedTrends)
      .where(lte(rankedTrends.rowNumber, limit))
      .execute();
  }

  async getArtistByUserId(twitterUserId: string): Promise<GetArtistByUserIdResponse | null> {
    const r = await this.client.select().from(artists).where(eq(artists.twitterUserId, twitterUserId)).limit(1);
    return r[0] ?? null;
  }

  async getArtistByUsername(username: string): Promise<GetArtistByUsernameResponse | null> {
    const r = await this.client.select().from(artists).where(eq(artists.username, username)).limit(1);
    return r[0] ?? null;
  }

  async getArtistUsernames(): Promise<GetArtistUsernamesResponse> {
    const r = await this.client
      .select({ username: artists.username })
      .from(artists)
      .where(ne(artists.isEnabled, false));
    return { items: r.map(item => item.username) };
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

  async getRandomArtist(): Promise<GetArtistRandomResponse | null> {
    const r = await this.client
      .select()
      .from(artists)
      .orderBy(sql`RANDOM()`)
      .where(and(ne(artists.isEnabled, false), gte(artists.followersCount, 300)))
      .limit(1);
    return r[0] ?? null;
  }

  async updateArtistInformation(
    id: string,
    body: UpdateArtistInformationBody
  ): Promise<UpdateArtistInformationResponse | null> {
    const result = await this.client
      .update(artists)
      .set({ ...body })
      .where(eq(artists.twitterUserId, id))
      .returning();
    return result[0] ?? null;
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

    if (result.length === 0) {
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
        .returning()
        .execute();
    });

    const results = await Promise.allSettled(promises);

    let errorResults: { id: string; reason: string }[] = [];
    const processedResults = results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value[0] ?? null;
        } else {
          errorResults.push({ id: body[index].id, reason: getErrorReason(result.reason) });
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
        .returning()
        .execute();
    });

    const results = await Promise.allSettled(promises);

    let errorResults: { id: string; reason: string }[] = [];
    const processedResults = results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value[0] ?? null;
        } else {
          errorResults.push({ id: body[index].id, reason: getErrorReason(result.reason) });
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
        .values({ ...profile, createdAt: new Date(profile.createdAt), url: `https://x.com/${profile.username}` })
        .returning()
        .execute();
    });

    const results = await Promise.allSettled(promises);

    let errorResults: { id: string; reason: string }[] = [];
    const processedResults = results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value[0] ?? null;
        } else {
          errorResults.push({
            id: body[index].twitterUserId,
            reason: getErrorReason(result.reason),
          });
          return null;
        }
      })
      .filter(result => result !== null);

    return { items: processedResults, errors: errorResults };
  }

  async getSuggestionsPaginated(query: GetSuggestionsQuery): Promise<GetSuggestionsResponse> {
    const filterOptions: SQL[] = [];
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
      filterOptions.push(ilike(artistsSuggestions.username, `%${query.username.trim()}%`));
    }
    if (query.status) {
      filterOptions.push(eq(artistsSuggestions.status, query.status));
    }
    if (query.tags && query.tags.length > 0) {
      filterOptions.push(arrayContains(artistsSuggestions.tags, query.tags));
    }

    const countResult = await this.client
      .select({ count: count() })
      .from(artistsSuggestions)
      .where(filterOptions.length > 0 ? and(...filterOptions) : undefined)
      .execute();

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
