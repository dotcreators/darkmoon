import { t } from 'elysia';

export const TagsModel = t.Array(t.String(), { minItems: 1 });

export const ImagesModel = t.Object({
  avatar: t.String(),
  banner: t.Optional(t.String()),
});

export const ResponseModel = t.Object({
  items: t.Any(),
  errors: t.Array(
    t.Object({
      id: t.String(),
      reason: t.String(),
    })
  ),
});

export const ArtistProfileModel = t.Object(
  {
    id: t.String(),
    twitterUserId: t.String(),
    username: t.String(),
    name: t.Nullable(t.String()),
    tweetsCount: t.Number(),
    followersCount: t.Number(),
    weeklyTweetsTrend: t.Number(),
    weeklyFollowersTrend: t.Number(),
    images: ImagesModel,
    tags: TagsModel,
    url: t.String(),
    country: t.Nullable(t.String()),
    website: t.Nullable(t.String()),
    bio: t.Nullable(t.String()),
    createdAt: t.Date({ format: 'date-time' }),
    joinedAt: t.Date({ format: 'date-time' }),
    updatedAt: t.Date({ format: 'date-time' }),
  },
  {
    description: 'Returns artist profile',
  }
);

export const ArtistSuggestionModel = t.Object({
  id: t.String(),
  username: t.String(),
  avatarUrl: t.String(),
  tags: TagsModel,
  status: t.String(),
  requestedFrom: t.String(),
  country: t.Nullable(t.String()),
  createdAt: t.Date({ format: 'date-time' }),
  updatedAt: t.Date({ format: 'date-time' }),
});
