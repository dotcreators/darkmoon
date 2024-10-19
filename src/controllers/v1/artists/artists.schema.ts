import { t } from 'elysia';

const ArtistAddSchema = t.Object({
  username: t.String(),
  userId: t.String(),
  followersCount: t.Number(),
  tweetsCount: t.Number(),
  images: t.Object({
    avatar: t.Nullable(t.String()),
    banner: t.Nullable(t.String()),
  }),
  joinedAt: t.Date(),
  name: t.String(),
  url: t.String(),
  bio: t.String(),
  website: t.String(),
});

const BulkArtistAddSchema = t.Array(
  t.Object({
    username: t.String(),
    userId: t.String(),
    followersCount: t.Number(),
    tweetsCount: t.Number(),
    images: t.Object({
      avatar: t.Nullable(t.String()),
      banner: t.Nullable(t.String()),
    }),
    joinedAt: t.Date(),
    name: t.String(),
    url: t.String(),
    bio: t.String(),
    website: t.String(),
  }),
  { minItems: 1 }
);

const ArtistsSearchSchema = t.Object({
  page: t.Numeric(),
  limit: t.Numeric(),
  username: t.Optional(t.String()),
  country: t.Optional(t.String()),
  tags: t.Optional(t.Array(t.String(), { minItems: 1 })),
  sortBy: t.Optional(t.String()),
});

const ArtistUpdateSchema = t.Object({
  tweetsCount: t.Numeric(),
  followersCount: t.Numeric(),
});

const BulkArtistUpdateSchema = t.Array(
  t.Object({
    artistId: t.String(),
    tweetsCount: t.Numeric(),
    followersCount: t.Numeric(),
  })
);

const ArtistEditSchema = t.Partial(
  t.Object({
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
  })
);

const BulkArtistDeleteSchema = t.Array(t.String());

export {
  ArtistAddSchema,
  BulkArtistAddSchema,
  ArtistsSearchSchema,
  ArtistUpdateSchema,
  ArtistEditSchema,
  BulkArtistUpdateSchema,
  BulkArtistDeleteSchema,
};
