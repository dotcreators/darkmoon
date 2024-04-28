import { t } from "elysia";

const ArtistsSuggestionSchema = t.Object({
  page: t.Numeric(),
  limit: t.Numeric(),
  requestStatus: t.String(),
});

const ArtistsCreateSuggestionSchema = t.Object({
  username: t.String(),
  country: t.Optional(t.String()),
  tags: t.Optional(t.Array(t.String(), { minItems: 1 })),
});

const ArtistEditSuggestionSchema = t.Object({
  requestStatus: t.String(),
});

const ArtistResponseSchema = t.Object({
  data: t.Array(
    t.Object({
      id: t.String(),
      username: t.String(),
      userId: t.String(),
      tweetsCount: t.Number(),
      followersCount: t.Number(),
      images: t.Object({
        avatar: t.MaybeEmpty(t.String()),
        banner: t.MaybeEmpty(t.String()),
      }),
      url: t.String(),
      joinedAt: t.Date(),
      createdAt: t.Date(),
      lastUpdatedAt: t.Date(),
      tags: t.Array(t.String(), { minItems: 1 }),
      name: t.MaybeEmpty(t.String()),
      country: t.MaybeEmpty(t.String()),
      website: t.MaybeEmpty(t.String()),
      bio: t.MaybeEmpty(t.String()),
    }),
    { minItems: 1 },
  ),
  has_next: t.Boolean(),
});

export {
  ArtistsSuggestionSchema,
  ArtistsCreateSuggestionSchema,
  ArtistEditSuggestionSchema,
  ArtistResponseSchema,
};
