import { ImagesModel, TagsModel } from 'controllers/v2/schemas/shared.schema';
import { t } from 'elysia';

const BaseArtistModel = t.Object({
  username: t.String(),
  name: t.String(),
  tags: TagsModel,
  country: t.String(),
  images: ImagesModel,
  bio: t.String(),
  website: t.String(),
});

export const ArtistsBodyModel = {
  EditArtist: t.Partial(BaseArtistModel, {
    description: 'Update artist profile with new selected field values',
  }),
  CreateArtist: t.Object(
    {
      twitterUserId: t.String(),
      tweetsCount: t.Number(),
      followersCount: t.Number(),
      createdAt: t.Date({ format: 'date-time' }),
      ...BaseArtistModel.properties,
    },
    { description: 'Create artist profile with provided values' }
  ),
  UpdateArtistInformations: t.Object(
    {
      weeklyFollowersTrend: t.Number(),
      weeklyTweetsTrend: t.Number(),
      ...BaseArtistModel.properties,
    },
    { description: 'Update artist profile trend stats' }
  ),
  CreateArtistBulk: t.Array(
    t.Object({
      twitterUserId: t.String(),
      tweetsCount: t.Number(),
      followersCount: t.Number(),
      createdAt: t.Date({ format: 'date-time' }),
      ...BaseArtistModel.properties,
    }),
    { description: 'Create multiple artist profiles with provided values' }
  ),
  EditArtistBulk: t.Array(
    t.Object({
      id: t.String(),
      data: t.Partial(BaseArtistModel),
    }),
    {
      description:
        'Update multiple artist profiles with new selected field values',
    }
  ),
  UpdateArtistInformationsBulk: t.Array(
    t.Object({
      id: t.String(),
      data: t.Object({
        weeklyFollowersTrend: t.Number(),
        weeklyTweetsTrend: t.Number(),
        ...BaseArtistModel.properties,
      }),
    }),
    { description: 'Update multiple artist profiles with new trend stats' }
  ),
};
