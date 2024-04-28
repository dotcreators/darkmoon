import Elysia from "elysia";
import { SuggestionsServices } from "./suggestions.services";
import {
  ArtistEditSuggestionSchema,
  ArtistsCreateSuggestionSchema,
  ArtistsSuggestionSchema,
} from "./suggestions.schema";

const suggestionsServices: SuggestionsServices = new SuggestionsServices();

const suggestionsRoutes = new Elysia({
  prefix: "/suggestions",
  detail: {
    tags: ["Suggestions"],
  },
})
  .get(
    "/",
    async ({ query }) => {
      const suggestedArtists =
        await suggestionsServices.getSuggestionsPaginated(query);

      return {
        success: true,
        data: suggestedArtists.data,
        has_next: suggestedArtists.has_next,
      };
    },
    {
      query: ArtistsSuggestionSchema,
    },
  )
  .post(
    "/",
    async ({ body }) => {
      suggestionsServices.createSuggestion(body);
    },
    {
      body: ArtistsCreateSuggestionSchema,
      transform({ body }) {
        if (typeof body.tags === "string") {
          body.tags = [body.tags];
        }
      },
    },
  )
  .patch(
    "/:suggestionId",
    ({ params: { suggestionId }, query }) => {
      suggestionsServices.updateStatusSuggestion(
        suggestionId,
        query.requestStatus,
      );
    },
    {
      query: ArtistEditSuggestionSchema,
    },
  );

export default suggestionsRoutes;
