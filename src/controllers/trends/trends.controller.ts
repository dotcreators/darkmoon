import { PrismaClient } from '@prisma/client';
import Elysia, { t } from 'elysia';

const trendsRoutes = new Elysia({
  prefix: '/trends',
  detail: {
    tags: ['Trends'],
  },
}).get(
  '/:artistId',
  async ({ params: { artistId } }) => {
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

      return {
        status: 'success',
        response: data,
      };
    } catch (e) {
      console.log(e);
    }
  }
  // {
  //   transform() {},
  //   query: t.String(),
  // }
);

export default trendsRoutes;
