import { t } from 'elysia';

export const ArtistProfileModel = t.Object({
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
});
