import { Artist, PrismaClient } from '@prisma/client';
import { ArtistSearchRequest } from '../../models/query/artists/ArtistSearchRequest';
import { error } from 'elysia';
import { ArtistEditRequest } from '../../models/query/artists/ArtistEditRequest';
import {
  ArtistUpdateRequest,
  BulkArtistUpdateRequest,
} from '../../models/query/artists/ArtistUpdateRequest';
import { ArtistCreateRequest } from '../../models/query/artists/ArtistCreateRequest';

export class ArtistsServices {
  private readonly prisma = new PrismaClient();

  async createArtist(request: ArtistCreateRequest): Promise<Artist> {
    const artist = await this.prisma.artist.create({
      data: {
        username: request.username,
        userId: request.userId,
        followersCount: request.followersCount,
        tweetsCount: request.tweetsCount,
        images: request.images,
        joinedAt: request.joinedAt,
        name: request.name,
        url: request.url,
        bio: request.bio,
        website: request.website,
      },
      select: {
        id: true,
        userId: true,
        username: true,
        url: true,
        followersCount: true,
        tweetsCount: true,
        images: true,
        createdAt: true,
        joinedAt: true,
        lastUpdatedAt: true,
        country: true,
        tags: true,
        bio: true,
        name: true,
        website: true,
        weeklyFollowersGrowingTrend: true,
        weeklyPostsGrowingTrend: true,
      },
    });

    return artist;
  }

  async bulkCreateArtist(request: ArtistCreateRequest[]): Promise<number> {
    const createPromises = request.map(artist => {
      return this.prisma.artist.create({
        data: {
          username: artist.username,
          userId: artist.userId,
          followersCount: artist.followersCount,
          tweetsCount: artist.tweetsCount,
          images: artist.images,
          joinedAt: artist.joinedAt,
          name: artist.name,
          url: artist.url,
          bio: artist.bio,
          website: artist.website,
        },
      });
    });

    const results = await Promise.all(createPromises);

    return results.length;
  }

  async getArtistsPaginated(
    request: ArtistSearchRequest
  ): Promise<{ data: Artist[]; has_next: boolean; total_pages: number }> {
    const orderFilter: any = {};
    if (request.sortBy == 'username') orderFilter.username = 'asc';
    else if (request.sortBy == 'followers') orderFilter.followersCount = 'desc';
    else if (request.sortBy == 'posts') orderFilter.tweetsCount = 'desc';
    else if (request.sortBy == 'trending')
      orderFilter.weeklyFollowersGrowingTrend = 'desc';
    else orderFilter.followersCount = 'desc';

    const whereFilter: any = {};
    if (request.username)
      whereFilter.username = {
        contains: request.username,
        mode: 'insensitive',
      };
    if (request.country) whereFilter.country = { equals: request.country };
    if (request.tags && request.tags.length > 0)
      whereFilter.tags = { hasEvery: request.tags };

    const totalCount = await this.prisma.artist.count({
      where: Object.keys(whereFilter).length > 0 ? whereFilter : undefined,
    });

    const data = await this.prisma.artist.findMany({
      take: request.limit,
      skip: (request.page - 1) * request.limit,
      where: Object.keys(whereFilter).length > 0 ? whereFilter : undefined,
      orderBy: orderFilter,
    });

    return {
      data: data as Artist[],
      has_next: data.length === request.limit ? true : false,
      total_pages: Math.ceil(totalCount / request.limit),
    };
  }

  async getArtistsUsernames(): Promise<string[]> {
    const data = await this.prisma.artist.findMany({
      select: {
        username: true,
      },
    });

    return data.map(artist => artist.username);
  }

  async getArtistsRandom() {
    const data = await this.prisma.$queryRaw<Artist[]>`
      SELECT * FROM "artists"
      WHERE "weeklyFollowersGrowingTrend" > 0
      ORDER BY RANDOM()
      LIMIT 1;
    `;

    if (!data) return null;
    return data[0];
  }

  async editArtist(
    artistId: string,
    request: ArtistEditRequest
  ): Promise<Artist> {
    const editFileds: any = {};
    if (request.username) editFileds.username = request.username;
    if (request.name) editFileds.name = request.name;
    if (request.tags) editFileds.tags = request.tags;
    if (request.country) editFileds.country = request.country;
    if (request.images) editFileds.images = request.images;
    if (request.bio) editFileds.bio = request.bio;
    if (request.url) editFileds.url = request.url;

    const data = await this.prisma.artist.update({
      where: { id: artistId },
      data: editFileds,
      select: {
        id: true,
        userId: true,
        username: true,
        url: true,
        followersCount: true,
        tweetsCount: true,
        images: true,
        createdAt: true,
        joinedAt: true,
        lastUpdatedAt: true,
        country: true,
        tags: true,
        bio: true,
        name: true,
        website: true,
        weeklyFollowersGrowingTrend: true,
        weeklyPostsGrowingTrend: true,
      },
    });

    return data;
  }

  async updateArtistStats(
    artistId: string,
    request: ArtistUpdateRequest
  ): Promise<Artist> {
    const data = await this.prisma.artist.update({
      where: {
        id: artistId,
      },
      data: {
        tweetsCount: request.tweetsCount,
        followersCount: request.followersCount,
      },
      select: {
        id: true,
        userId: true,
        username: true,
        url: true,
        followersCount: true,
        tweetsCount: true,
        images: true,
        createdAt: true,
        joinedAt: true,
        lastUpdatedAt: true,
        country: true,
        tags: true,
        bio: true,
        name: true,
        website: true,
        weeklyFollowersGrowingTrend: true,
        weeklyPostsGrowingTrend: true,
      },
    });

    return data;
  }

  async bulkUpdateArtistsStats(
    request: BulkArtistUpdateRequest[]
  ): Promise<Number> {
    try {
      const updatePromises = request.map(request => {
        return this.prisma.artist.updateMany({
          where: {
            id: request.artistId,
          },
          data: {
            tweetsCount: request.tweetsCount,
            followersCount: request.followersCount,
          },
        });
      });

      const results = await Promise.all(updatePromises);

      return results.length;
    } catch (e) {
      console.error('Error while bulk updating artists:', e);
      throw e;
    }
  }

  async deleteArtist(artistId: string): Promise<void> {
    this.prisma.artist.delete({
      where: {
        id: artistId,
      },
    });
  }

  async bulkDeleteArtists(artistsIds: string[]): Promise<void> {
    const deletePromises = artistsIds.map(id => {
      return this.prisma.artist.delete({
        where: {
          id: id,
        },
      });
    });

    await Promise.all(deletePromises);
  }
}
