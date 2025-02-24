import Elysia from 'elysia';
import artistsRoutes from './artists/artists.controller';
import suggestionsRoutes from './suggestions/suggestions.controller';
import fetchRoutes from './fetch/fetch.controller';
import trendsRoutes from './trends/trends.controller';
import authRoutes from './auth/auth.controller';

export const API_ENDPOINTS_V1 = new Elysia()
  .group('/v1', app => app.use(artistsRoutes))
  .group('/v1', app => app.use(suggestionsRoutes))
  .group('/v1', app => app.use(fetchRoutes))
  .group('/v1', app => app.use(trendsRoutes))
  .group('/v1', app => app.use(authRoutes));
