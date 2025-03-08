import { ArtistProfileModel, ArtistTrendModel, ResponseModel } from 'controllers/v2/schemas/shared.schema';
import { t } from 'elysia';

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
  GetArtistWithTrends: t.Object(
    {
      page: t.Number(),
      perPage: t.Number(),
      totalPages: t.Number(),
      totalItems: t.Number(),
      items: t.Array(
        t.Object({
          artist: ArtistProfileModel,
          trends: t.Array(ArtistTrendModel),
        }),
        { minItems: 0 }
      ),
    },
    { description: 'Returns paginated artists profiles' }
  ),
  GetRandomArtist: ArtistProfileModel,
  CreateArtist: ArtistProfileModel,
  EditArtist: ArtistProfileModel,
  UpdateArtistInformation: ArtistProfileModel,
  UpdateArtistInformationBulk: ResponseModel,
  CreateArtistBulk: ResponseModel,
  EditArtistBulk: ResponseModel,
};
