import { Static, t } from 'elysia';

const ArtistTagsModel = t.Nullable(
  t.Object({
    items: t.Array(t.String(), { minItems: 0 }),
  })
);

const ArtistImagesModel = t.Object({
  avatar: t.String(),
  banner: t.Optional(t.String()),
});

const ArtistProfileModel = t.Object(
  {
    id: t.String(),
    twitterUserId: t.String(),
    username: t.String(),
    name: t.Nullable(t.String()),
    tweetsCount: t.Number(),
    followersCount: t.Number(),
    weeklyTweetsTrend: t.Number(),
    weeklyFollowersTrend: t.Number(),
    images: ArtistImagesModel,
    tags: ArtistTagsModel,
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

const ArtistSuggestionModel = t.Object({
  id: t.String(),
  username: t.String(),
  avatarUrl: t.String(),
  tags: ArtistTagsModel,
  status: t.String(),
  requestedFrom: t.String(),
  country: t.Nullable(t.String()),
  createdAt: t.Date({ format: 'date-time' }),
  updatedAt: t.Date({ format: 'date-time' }),
});

export {
  ArtistProfileModel,
  ArtistImagesModel,
  ArtistTagsModel,
  ArtistSuggestionModel,
};

export type ArtistSuggestionType = Static<typeof ArtistSuggestionModel>;
export type ArtistProfileType = Static<typeof ArtistProfileModel>;
