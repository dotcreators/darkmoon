import { PrismaClient } from '@prisma/client';
import Elysia, { t } from 'elysia';

const trendsRoutes = new Elysia({
  prefix: '/trends',
  detail: {
    tags: ['Trends'],
  },
}).get('/:artistId', async ({ params: { artistId } }) => {
  try {
    const prisma = new PrismaClient();
    const data = await prisma.artistTrending.findMany({
      where: { userId: artistId },
      select: {
        followersCount: true,
        tweetsCount: true,
        recordedAt: true,
      },
      orderBy: {
        recordedAt: 'asc',
      },
    });

    if (data) {
      return {
        status: 'success',
        response: data,
      };
    } else {
      return {
        status: 'success',
        response: 'Trends data is not created for this artist',
      };
    }
  } catch (e) {
    console.log(e);
  }
});

export default trendsRoutes;
