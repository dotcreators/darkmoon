import { Static, t } from 'elysia';
import {
  ArtistImagesModel,
  ArtistProfileModel,
  ArtistTagsModel,
} from '../shared.schema';

export const ArtistsQueryModel = {
  GetArtist: t.Object(
    {
      page: t.Number(),
      perPage: t.Number(),
      username: t.Optional(t.String()),
      country: t.Optional(t.String()),
      /* 
        Here need custom tags type definition for query, because
        this type allow to accept array of tags like ["pixelart", "gamedev"],
        which is creating on frontend side
      */
      tags: t.Optional(t.Array(t.String(), { minItems: 1 })),
      sortBy: t.Optional(t.String()),
    },
    { description: 'Get artist profiles with selected options' }
  ),
};

export const ArtistsBodyModel = {
  EditArtist: t.Partial(
    t.Object(
      {
        username: t.String(),
        name: t.String(),
        tags: ArtistTagsModel,
        country: t.String(),
        images: ArtistImagesModel,
        bio: t.String(),
        website: t.String(),
      },
      { description: 'Update artist profiles with new selected field values' }
    )
  ),
  CreateArtist: t.Object({
    twitterUserId: t.String(),
    username: t.String(),
    tweetsCount: t.Number(),
    followersCount: t.Number(),
    images: ArtistImagesModel,
    tags: ArtistTagsModel,
    name: t.Nullable(t.String()),
    url: t.String(),
    country: t.Nullable(t.String()),
    website: t.Nullable(t.String()),
    bio: t.Nullable(t.String()),
    createdAt: t.Date({ format: 'date-time' }),
  }),
  UpdateArtistInformations: t.Object(
    {
      username: t.String(),
      name: t.String(),
      country: t.String(),
      bio: t.String(),
      url: t.String(),
      images: ArtistImagesModel,
      weeklyFollowersTrend: t.Number(),
      weeklyTweetsTrend: t.Number(),
    },
    { description: 'Update artist profile trend stats' }
  ),
};

export const ArtistsReponseModel = {
  GetArtist: t.Object(
    {
      page: t.Number(),
      perPage: t.Number(),
      totalPages: t.Number(),
      totalItems: t.Number(),
      items: t.Array(ArtistProfileModel, { minItems: 0 }),
    },
    { description: 'Returns paginated artists profiles' }
  ),
  GetRandomArtist: ArtistProfileModel,
  CreateArtist: ArtistProfileModel,
  EditArtist: ArtistProfileModel,
  UpdateArtistInformation: ArtistProfileModel,
};

export type GetArtistQuery = Static<typeof ArtistsQueryModel.GetArtist>;
export type GetArtistResponse = Static<typeof ArtistsReponseModel.GetArtist>;

export type GetArtistRandomResponse = Static<
  typeof ArtistsReponseModel.GetRandomArtist
>;

export type EditArtistBody = Static<typeof ArtistsBodyModel.EditArtist>;
export type EditArtistResponse = Static<typeof ArtistsReponseModel.EditArtist>;

export type UpdateArtistInformationBody = Static<
  typeof ArtistsBodyModel.UpdateArtistInformations
>;
export type UpdateArtistInformationResponse = Static<
  typeof ArtistsReponseModel.UpdateArtistInformation
>;

export type CreateArtistBody = Static<typeof ArtistsBodyModel.CreateArtist>;
export type CreateArtistResponse = Static<
  typeof ArtistsReponseModel.CreateArtist
>;
