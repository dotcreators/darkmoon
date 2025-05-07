import { t } from 'elysia';

export const ArtistsParamsMode = {
  GetArtistByUserId: t.Object(
    {
      id: t.String(),
    },
    { description: 'Get artist profiles by twitter user id' }
  ),
};
