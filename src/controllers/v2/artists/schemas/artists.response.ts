import { ArtistProfileModel, ResponseModel } from 'controllers/v2/schemas/shared.schema';
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
  GetRandomArtist: ArtistProfileModel,
  CreateArtist: ArtistProfileModel,
  EditArtist: ArtistProfileModel,
  UpdateArtistInformation: ArtistProfileModel,
  UpdateArtistInformationBulk: ResponseModel,
  CreateArtistBulk: ResponseModel,
  EditArtistBulk: ResponseModel,
};
