import { t } from 'elysia';

const ArtistTagsModel = t.Nullable(
  t.Object({
    items: t.Array(t.String(), { minItems: 0 }),
  })
);

const ArtistImagesModel = t.Object({
  avatar: t.String(),
  banner: t.Optional(t.String()),
});

const ArtistProfileModel = t.Object({
  id: t.String(),
  username: t.String(),
  userId: t.String(),
  tweetsCount: t.Number(),
  followersCount: t.Number(),
  images: ArtistImagesModel,
  url: t.String({ format: 'uri' }),
  tags: ArtistTagsModel,
  name: t.Nullable(t.String()),
  country: t.Nullable(t.String()),
  website: t.Nullable(t.String()),
  bio: t.Nullable(t.String()),
  weeklyFollowersTrend: t.Number(),
  weeklyTweetsTrend: t.Number(),
  created: t.String({ format: 'date-time' }),
  joined: t.String({ format: 'date-time' }),
  updated: t.String({ format: 'date-time' }),
});

export { ArtistProfileModel, ArtistImagesModel, ArtistTagsModel };
