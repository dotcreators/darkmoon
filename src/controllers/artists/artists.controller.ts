import { Elysia, t } from 'elysia'
import { ArtistsServices } from './artists.services'
import {
  ArtistEditSchema,
  ArtistUpdateSchema,
  ArtistsSearchSchema,
  BulkArtistDeleteSchema,
  BulkArtistUpdateSchema,
} from './artists.schema'
import { model } from '../../models/Model'

const artistsServices: ArtistsServices = new ArtistsServices()

const artistsRoutes = new Elysia({
  prefix: '/artists',
  detail: {
    tags: ['Artists'],
  },
})
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const artists = await artistsServices.getArtistsPaginated(query)
        return {
          status: 'success',
          response: {
            data: artists.data,
            has_next: artists.has_next,
          },
        }
      } catch (e) {
        set.status = 500
        return {
          status: 'error',
          response: e,
        }
      }
    },
    {
      transform({ query }) {
        if (typeof query.tags === 'string') {
          query.tags = [query.tags]
        }
      },
      beforeHandle({ query, error, set }) {
        if (query.limit > 100) {
          set.status = 400
          return {
            status: 'error',
            response: 'Maximum artists query limit is 100!',
          }
        }
      },
      query: ArtistsSearchSchema,
      response: {
        200: model['artists.get'],
        400: model['api.error'],
        500: model['api.error'],
      },
    }
  )
  .patch(
    '/:artistId',
    async ({ params: { artistId }, query, set }) => {
      try {
        const editedArtist = await artistsServices.editArtist(artistId, query)
        return {
          status: 'success',
          response: editedArtist,
        }
      } catch (e) {
        set.status = 500
        return {
          status: 'error',
          response: e,
        }
      }
    },
    {
      transform({ query }) {
        if (typeof query.tags === 'string') {
          query.tags = [query.tags]
        }
      },
      beforeHandle({ query, set }) {
        if (Object.keys(query).length == 0) set.status = 400
        return {
          status: 'error',
          response: 'Specify at least 1 of user edit options are represented!',
        }
      },
      query: ArtistEditSchema,
      response: {
        200: model['artists.get'],
        400: model['api.error'],
        500: model['api.error'],
      },
    }
  )
  .patch(
    '/stats/single/:artistId',
    async ({ params: { artistId }, query, set }) => {
      try {
        const updatedArtist = await artistsServices.updateArtistStats(
          artistId,
          query
        )
        return {
          status: 'success',
          response: updatedArtist,
        }
      } catch (e) {
        set.status = 500
        return {
          status: 'error',
          response: e,
        }
      }
    },
    {
      transform() {},
      query: ArtistUpdateSchema,
      response: {
        200: model['artists.updateSingle'],
        400: model['api.error'],
        500: model['api.error'],
      },
    }
  )
  .patch(
    '/stats/bulk',
    async ({ body, set }) => {
      try {
        const updatedArtistsCount =
          await artistsServices.bulkUpdateArtistsStats(body)
        return {
          status: 'success',
          response: updatedArtistsCount,
        }
      } catch (e) {
        set.status = 500
        return {
          status: 'error',
          response: e,
        }
      }
    },
    {
      transform() {},
      body: BulkArtistUpdateSchema,
      response: {
        200: model['artists.updateBatch'],
        400: model['api.error'],
        500: model['api.error'],
      },
    }
  )
  .delete(
    '/:artistId',
    async ({ params: { artistId }, set }) => {
      try {
        artistsServices.deleteArtist(artistId)
        return {
          status: 'success',
          response: 'OK Gone',
        }
      } catch (e) {
        set.status = 500
        return {
          status: 'error',
          response: e,
        }
      }
    },
    {
      transform() {},
      response: {
        200: model['artists.delete'],
        400: model['api.error'],
        500: model['api.error'],
      },
    }
  )
  .delete(
    '/bulk',
    ({ body, set }) => {
      try {
        artistsServices.bulkDeleteArtists(<string[]>body)
        return {
          status: 'success',
          response: 'OK Gone',
        }
      } catch (e) {
        set.status = 500
        return {
          status: 'error',
          response: e,
        }
      }
    },
    {
      transform() {},
      response: {
        200: model['artists.delete'],
        400: model['api.error'],
        500: model['api.error'],
      },
    }
  )

export default artistsRoutes
