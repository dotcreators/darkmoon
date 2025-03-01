import Elysia from 'elysia';
import artistsRoutes from './artists/artists.controller';
import trendsRoutes from './trends/trends.controller';
import suggestionsRoutes from './suggestions/suggestions.controller';

export const API_ENDPOINTS_V2 = new Elysia()
  .group('/v2', app => app.use(artistsRoutes))
  .group('/v2', app => app.use(suggestionsRoutes))
  .group('/v2', app => app.use(trendsRoutes));
