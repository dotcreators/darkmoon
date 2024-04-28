import { UnwrapSchema, t } from 'elysia'

export const model = {
  'api.error': t.Object(
    {
      status: t.String({ default: 'error' }),
      response: t.String(),
    },
    {
      description: 'API Error',
    }
  ),
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
              avatar: t.Nullable(t.String()),
              banner: t.Nullable(t.String()),
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
          { minItems: 1 }
        ),
        has_next: t.Boolean(),
      }),
    },
    {
      description: 'Get paginated artists profiles',
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
          avatar: t.Nullable(t.String()),
          banner: t.Nullable(t.String()),
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
          avatar: t.Nullable(t.String()),
          banner: t.Nullable(t.String()),
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
}

export interface Model {
  artists: {
    get: UnwrapSchema<(typeof model)['artists.get']>
    edit: UnwrapSchema<(typeof model)['artists.edit']>
    updateSingle: UnwrapSchema<(typeof model)['artists.updateSingle']>
  }
  api: {
    error: UnwrapSchema<(typeof model)['api.error']>
  }
}
