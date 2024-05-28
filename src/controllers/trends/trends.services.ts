import { ArtistTrending } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

export class TrendsServices {
  private readonly prisma = new PrismaClient();

  async getArtistTrend(
    artistId: string,
    range: number
  ): Promise<Omit<ArtistTrending, 'userId' | 'id'>[]> {
    const artistTrends = await this.prisma.artistTrending.findMany({
      where: { userId: artistId },
      select: {
        followersCount: true,
        tweetsCount: true,
        recordedAt: true,
      },
      orderBy: {
        recordedAt: 'asc',
      },
      take: range,
    });

    return artistTrends;
  }
}
