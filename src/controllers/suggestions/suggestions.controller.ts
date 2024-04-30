import Elysia from 'elysia'
import { SuggestionsServices } from './suggestions.services'
import {
  ArtistEditSuggestionSchema,
  ArtistsCreateSuggestionSchema,
  ArtistsSuggestionSchema,
} from './suggestions.schema'
import { suggestionsResponses } from '../../models/responses/SuggestionsResponses'
import { errorResponses } from '../../models/responses/ErrorsResponses'

const suggestionsServices: SuggestionsServices = new SuggestionsServices()

const suggestionsRoutes = new Elysia({
  prefix: '/suggestions',
  detail: {
    tags: ['Suggestions'],
  },
})
  .get(
    '/',
    async ({ query }) => {
      const suggestedArtists =
        await suggestionsServices.getSuggestionsPaginated(query)

      return {
        success: true,
        data: suggestedArtists.data,
        has_next: suggestedArtists.has_next,
      }
    },
    {
      transform() {},
      query: ArtistsSuggestionSchema,
      response: {
        200: suggestionsResponses['suggestions.get'],
        400: errorResponses['api.badrequest'],
        500: errorResponses['api.error'],
      },
    }
  )
  .post(
    '/',
    async ({ body }) => {
      suggestionsServices.createSuggestion(body)
    },
    {
      transform({ body }) {
        if (typeof body.tags === 'string') {
          body.tags = [body.tags]
        }
      },
      body: ArtistsCreateSuggestionSchema,
      response: {
        200: suggestionsResponses['suggestions.create'],
        400: errorResponses['api.badrequest'],
        500: errorResponses['api.error'],
      },
    }
  )
  .patch(
    '/:suggestionId',
    ({ params: { suggestionId }, query }) => {
      suggestionsServices.updateStatusSuggestion(
        suggestionId,
        query.requestStatus
      )
    },
    {
      transform() {},
      query: ArtistEditSuggestionSchema,
      response: {
        200: suggestionsResponses['suggestions.update'],
        400: errorResponses['api.badrequest'],
        500: errorResponses['api.error'],
      },
    }
  )

export default suggestionsRoutes
