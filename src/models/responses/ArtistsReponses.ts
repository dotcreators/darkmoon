import { UnwrapSchema, t } from 'elysia';

export const artistsResponses = {
  'artists.get': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Object({
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
            url: t.String(),
            joinedAt: t.Date(),
            createdAt: t.Date(),
            lastUpdatedAt: t.Date(),
            tags: t.Nullable(t.Array(t.String(), { minItems: 0 })),
            name: t.Nullable(t.String()),
            country: t.Nullable(t.String()),
            website: t.Nullable(t.String()),
            bio: t.Nullable(t.String()),
          }),
          { minItems: 0 }
        ),
        has_next: t.Boolean(),
        total_pages: t.Number(),
      }),
    },
    {
      description: 'Get paginated artists profiles',
    }
  ),
  'artists.usernames': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Array(t.String(), { minItems: 0 }),
    },
    {
      description: 'All artists usernames (for SEO)',
    }
  ),
  'artists.create': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Object({
        id: t.String(),
        username: t.String(),
        userId: t.String(),
        tweetsCount: t.Number(),
        followersCount: t.Number(),
        images: t.Object({
          avatar: t.String(),
          banner: t.Optional(t.String()),
        }),
        url: t.String(),
        joinedAt: t.Date(),
        createdAt: t.Date(),
        lastUpdatedAt: t.Date(),
        tags: t.Nullable(t.Array(t.String(), { minItems: 0 })),
        name: t.Nullable(t.String()),
        country: t.Nullable(t.String()),
        website: t.Nullable(t.String()),
        bio: t.Nullable(t.String()),
      }),
    },
    {
      description: 'Create artist profile',
    }
  ),
  'artists.createBulk': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Array(
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
          url: t.String(),
          joinedAt: t.Date(),
          createdAt: t.Date(),
          lastUpdatedAt: t.Date(),
          tags: t.Nullable(t.Array(t.String(), { minItems: 0 })),
          name: t.Nullable(t.String()),
          country: t.Nullable(t.String()),
          website: t.Nullable(t.String()),
          bio: t.Nullable(t.String()),
        })
      ),
    },
    {
      description: 'Create artist profile',
    }
  ),
  'artists.edit': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Object({
        id: t.String(),
        username: t.String(),
        userId: t.String(),
        tweetsCount: t.Number(),
        followersCount: t.Number(),
        images: t.Object({
          avatar: t.String(),
          banner: t.Optional(t.String()),
        }),
        url: t.String(),
        joinedAt: t.Date(),
        createdAt: t.Date(),
        lastUpdatedAt: t.Date(),
        tags: t.Nullable(t.Array(t.String(), { minItems: 0 })),
        name: t.Nullable(t.String()),
        country: t.Nullable(t.String()),
        website: t.Nullable(t.String()),
        bio: t.Nullable(t.String()),
      }),
    },
    {
      description: 'Edit artist profile information',
    }
  ),
  'artists.updateSingle': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Object({
        id: t.String(),
        username: t.String(),
        userId: t.String(),
        tweetsCount: t.Number(),
        followersCount: t.Number(),
        images: t.Object({
          avatar: t.String(),
          banner: t.Optional(t.String()),
        }),
        url: t.String(),
        joinedAt: t.Date(),
        createdAt: t.Date(),
        lastUpdatedAt: t.Date(),
        tags: t.Nullable(t.Array(t.String(), { minItems: 0 })),
        name: t.Nullable(t.String()),
        country: t.Nullable(t.String()),
        website: t.Nullable(t.String()),
        bio: t.Nullable(t.String()),
      }),
    },
    {
      description: 'Update artist followers and posts count',
    }
  ),
  'artists.updateBulk': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Number(),
    },
    {
      description: 'Delete artist profile',
    }
  ),
  'artists.delete': t.Object(
    {
      status: t.String({ default: 'success' }),
      response: t.Number(),
    },
    {
      description: 'Batched update artist followers and posts count',
    }
  ),
};

export interface ArtistsResponsesModel {
  artists: {
    create: UnwrapSchema<(typeof artistsResponses)['artists.create']>;
    createBulk: UnwrapSchema<(typeof artistsResponses)['artists.createBulk']>;
    get: UnwrapSchema<(typeof artistsResponses)['artists.get']>;
    edit: UnwrapSchema<(typeof artistsResponses)['artists.edit']>;
    delete: UnwrapSchema<(typeof artistsResponses)['artists.delete']>;
    updateSingle: UnwrapSchema<
      (typeof artistsResponses)['artists.updateSingle']
    >;
    updateBulk: UnwrapSchema<(typeof artistsResponses)['artists.updateBulk']>;
    usernames: UnwrapSchema<(typeof artistsResponses)['artists.usernames']>;
  };
}
