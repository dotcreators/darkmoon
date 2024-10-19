import { Elysia, error, StatusMap, t } from 'elysia';

import { ErrorResponseModel } from '../error.schema';
import {
  ArtistGetResponse,
  ArtistReponseModel,
  ArtistsModel,
} from './artists.schema';

const artistsRoutesV2 = new Elysia({
  prefix: '/artists',
  detail: {
    tags: ['Artists'],
  },
}).get(
  '/',
  async ({ query }) => {
    if (query.perPage > 100 || query.perPage < 0) {
      return error(400, {
        status: StatusMap['Bad Request'],
        response: {
          error: 'Query error',
          message:
            'Maximum artists query must be greater than 0 and limited by 100',
        },
      });
    } else if (query.page < 0) {
      return error(400, {
        status: StatusMap['Bad Request'],
        response: {
          error: 'Query error',
          message: 'Page value must be greater than 0',
        },
      });
    }

    const r: ArtistGetResponse = {
      page: 1,
      perPage: 100,
      totalPages: 1,
      totalItems: 1,
      data: [
        {
          id: '0a36279d-c8d0-45a0-a419-094e48da8155',
          username: 'waneella_',
          userId: '808877428852621312',
          tweetsCount: 2165,
          followersCount: 235082,
          images: {
            avatar:
              'https://pbs.twimg.com/profile_images/963497012871221248/GS9G3Ykj.jpg',
            banner:
              'https://pbs.twimg.com/profile_banners/808877428852621312/1700615992',
          },
          url: 'https://x.com/waneella_',
          joinedAt: '2016-12-14T03:33:02.000Z',
          createdAt: '2024-06-22T00:00:01.637Z',
          lastUpdatedAt: '2024-10-19T00:00:32.509Z',
          tags: ['pixelart', 'animation'],
          name: 'waneella',
          country: 'ru',
          website: '',
          bio: 'Pixel artist. Prints and links: https://waneella.com/ Working on Slime 3K with @DespotsGames',
          weeklyFollowersGrowingTrend: -0.086,
          weeklyPostsGrowingTrend: 0,
        },
      ],
    };

    return r;
  },
  {
    transform({ query }) {
      if (typeof query.tags === 'string') {
        query.tags = [query.tags];
      }
    },
    query: ArtistsModel.ArtistsQuery,
    response: {
      200: ArtistReponseModel.Artists,
      400: ErrorResponseModel.BadRequest,
      500: ErrorResponseModel.InternalServerError,
    },
  }
);

export default artistsRoutesV2;

// Argument of type '() => Promise<{ page: number; perPage: number; totalPages: number; totalItems: number; data: { tags: string[]; id: string; username: string; userId: string; tweetsCount: number; followersCount: number; images: { ...; }; ... 9 more ...; weeklyPostsGrowingTrend: number; }[]; } | ElysiaCustomStatusResponse<...> | undef...' is not assignable to parameter of type 'InlineHandler<MergeSchema<UnwrapRoute<{ readonly transform: unknown; readonly beforeHandle: unknown; readonly query: TObject<{ page: TNumber; perPage: TNumber; username: TOptional<TString>; country: TOptional<TString>; tags: TOptional<...>; sortBy: TOptional<...>; }>; readonly response: { ...; }; }, {}>, MergeSchema...'.
//   Type '() => Promise<{ page: number; perPage: number; totalPages: number; totalItems: number; data: { tags: string[]; id: string; username: string; userId: string; tweetsCount: number; followersCount: number; images: { ...; }; ... 9 more ...; weeklyPostsGrowingTrend: number; }[]; } | ElysiaCustomStatusResponse<...> | undef...' is not assignable to type '(context: { body: unknown; query: { tags?: string[] | undefined; username?: string | undefined; country?: string | undefined; sortBy?: string | undefined; page: number; perPage: number; }; params: never; headers: Record<...>; ... 9 more ...; error: <const Code extends "OK" | 200, const T extends Code extends 200 ? {...'.
//     Type 'Promise<{ page: number; perPage: number; totalPages: number; totalItems: number; data: { tags: string[]; id: string; username: string; userId: string; tweetsCount: number; followersCount: number; images: { ...; }; ... 9 more ...; weeklyPostsGrowingTrend: number; }[]; } | ElysiaCustomStatusResponse<...> | undefined>' is not assignable to type 'Response | MaybePromise<{ readonly 200: { page: number; perPage: number; totalPages: number; totalItems: number; data: { tags: string[]; id: string; username: string; userId: string; tweetsCount: number; followersCount: number; ... 10 more ...; weeklyPostsGrowingTrend: number; }[]; }; } | { ...; } | ElysiaCustomStat...'.
//       Type 'Promise<{ page: number; perPage: number; totalPages: number; totalItems: number; data: { tags: string[]; id: string; username: string; userId: string; tweetsCount: number; followersCount: number; images: { ...; }; ... 9 more ...; weeklyPostsGrowingTrend: number; }[]; } | ElysiaCustomStatusResponse<...> | undefined>' is not assignable to type 'Promise<{ readonly 200: { page: number; perPage: number; totalPages: number; totalItems: number; data: { tags: string[]; id: string; username: string; userId: string; tweetsCount: number; followersCount: number; images: { ...; }; ... 9 more ...; weeklyPostsGrowingTrend: number; }[]; }; } | { ...; } | ElysiaCustomSta...'.
//         Type '{ page: number; perPage: number; totalPages: number; totalItems: number; data: { tags: string[]; id: string; username: string; userId: string; tweetsCount: number; followersCount: number; images: { banner?: string | undefined; avatar: string; }; ... 9 more ...; weeklyPostsGrowingTrend: number; }[]; } | ElysiaCustomS...' is not assignable to type '{ readonly 200: { page: number; perPage: number; totalPages: number; totalItems: number; data: { tags: string[]; id: string; username: string; userId: string; tweetsCount: number; followersCount: number; images: { ...; }; ... 9 more ...; weeklyPostsGrowingTrend: number; }[]; }; } | { ...; } | ElysiaCustomStatusRespo...'.
//           Type 'undefined' is not assignable to type '{ readonly 200: { page: number; perPage: number; totalPages: number; totalItems: number; data: { tags: string[]; id: string; username: string; userId: string; tweetsCount: number; followersCount: number; images: { ...; }; ... 9 more ...; weeklyPostsGrowingTrend: number; }[]; }; } | { ...; } | ElysiaCustomStatusRespo...'.
