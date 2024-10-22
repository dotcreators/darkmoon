import Elysia from 'elysia';
import artistsRoutes from './artists/artists.controller';
import suggestionsRoutes from './suggestions/suggestions.controller';

export const apiEndpointsV2 = new Elysia()
  .group('/v2', app => app.use(artistsRoutes))
  .group('/v2', app => app.use(suggestionsRoutes));
