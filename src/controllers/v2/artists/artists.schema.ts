import { Static, t } from 'elysia';

export const ArtistsModel = {
  ArtistsQuery: t.Object(
    {
      page: t.Number(),
      perPage: t.Number(),
      username: t.Optional(t.String()),
      country: t.Optional(t.String()),
      tags: t.Optional(t.Array(t.String(), { minItems: 1 })),
      sortBy: t.Optional(t.String()),
    },
    { description: 'Get artist profiles with selected options' }
  ),
  EditArtist: t.Object({
    username: t.String(),
    name: t.String(),
    tags: t.Array(t.String(), { minItems: 1 }),
    country: t.String(),
    images: t.Object({
      avatar: t.String(),
      banner: t.String(),
    }),
    bio: t.String(),
    url: t.String(),
  }),
};

export const ArtistReponseModel = {
  Artists: t.Object(
    {
      page: t.Number(),
      perPage: t.Number(),
      totalPages: t.Number(),
      totalItems: t.Number(),
      data: t.Array(
        t.Object({
          id: t.String(),
          username: t.String(),
          userId: t.String(),
          tweetsCount: t.Number(),
          followersCount: t.Number(),
          images: t.Object({
            avatar: t.String(),
            banner: t.Optional(t.String()),
          }),
          url: t.String({ format: 'uri' }),
          joinedAt: t.String({ format: 'date-time' }),
          createdAt: t.String({ format: 'date-time' }),
          lastUpdatedAt: t.String({ format: 'date-time' }),
          tags: t.Array(t.String(), { minItems: 0 }),
          name: t.Nullable(t.String()),
          country: t.Nullable(t.String()),
          website: t.Nullable(t.String()),
          bio: t.Nullable(t.String()),
          weeklyFollowersGrowingTrend: t.Number(),
          weeklyPostsGrowingTrend: t.Number(),
        }),
        { minItems: 0 }
      ),
    },
    {
      description: 'Returns paginated artists profiles',
    }
  ),
};

export type ArtistGetResponse = Static<typeof ArtistReponseModel.Artists>;
export type ArtistsGetQuery = Static<typeof ArtistsModel.ArtistsQuery>;
