import { Static, t } from 'elysia';
import { ArtistProfileModel } from '../shared.schema';

export const ArtistsQueryModel = {
  GetArtist: t.Object(
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
  EditArtist: t.Partial(
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
  ),
};

export const ArtistsReponseModel = {
  GetArtist: t.Object(
    {
      page: t.Number(),
      perPage: t.Number(),
      totalPages: t.Number(),
      totalItems: t.Number(),
      data: t.Array(ArtistProfileModel, { minItems: 0 }),
    },
    { description: 'Returns paginated artists profiles' }
  ),
  EditArtist: t.Object(
    { ArtistProfileModel },
    { description: 'Returns updated artist profile' }
  ),
};

export type GetArtistQuery = Static<typeof ArtistsQueryModel.GetArtist>;
export type GetArtistResponse = Static<typeof ArtistsReponseModel.GetArtist>;

export type EditArtistQuery = Static<typeof ArtistsQueryModel.EditArtist>;
export type EditArtistResponse = Static<typeof ArtistsReponseModel.EditArtist>;
