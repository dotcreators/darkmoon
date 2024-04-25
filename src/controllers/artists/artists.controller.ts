import { Elysia } from "elysia";
import { ArtistsSearchQuery } from "../../models/query/ArtistsSearchQuery";
import { ArtistEditRequest } from "../../models/query/ArtistEditRequest";
import { ArtistsServices } from "./artists.services";
import {
  ArtistEditSchema,
  ArtistUpdateSchema,
  ArtistsSearchSchema,
  BulkArtistDeleteSchema,
  BulkArtistUpdateSchema,
} from "./artists.schema";
import {
  ArtistUpdateRequest,
  BulkArtistUpdateRequest,
} from "../../models/query/ArtistsUpdateRequest";

const artistsServices: ArtistsServices = new ArtistsServices();

const artistsRoutes = new Elysia({ prefix: "/artists" })
  .get(
    "/",
    ({ query }) =>
      artistsServices.getArtistsPaginated(<ArtistsSearchQuery>query),
    {
      query: ArtistsSearchSchema,
      transform({ query }) {
        if (typeof query.tags === "string") {
          query.tags = [query.tags];
        }
      },
      beforeHandle({ query, error }) {
        if (query.limit > 100)
          return error("Bad Request", "Maximum artists query limit is 100!");
      },
    },
  )
  .patch(
    "/:artistId",
    ({ params: { artistId }, query }) =>
      artistsServices.editArtist(artistId, <ArtistEditRequest>query),
    {
      query: ArtistEditSchema,
      transform({ query }) {
        if (typeof query.tags === "string") {
          query.tags = [query.tags];
        }
      },
      beforeHandle({ query, error }) {
        if (Object.keys(query).length == 0)
          return error(
            "Bad Request",
            "Specify at least 1 of user edit options are represented!",
          );
      },
    },
  )
  .patch(
    "/stats/single/:artistId",
    ({ params: { artistId }, query }) =>
      artistsServices.updateArtistStats(artistId, <ArtistUpdateRequest>query),
    { query: ArtistUpdateSchema },
  )
  .patch(
    "/stats/bulk",
    ({ body }) =>
      artistsServices.bulkUpdateArtistsStats(<BulkArtistUpdateRequest[]>body),
    { body: BulkArtistUpdateSchema },
  )
  .delete("/:artistId", ({ params: { artistId } }) => {
    artistsServices.deleteArtist(artistId);
  })
  .delete("/bulk", ({ body }) => {
    artistsServices.bulkDeleteArtists(<string[]>body),
      { body: BulkArtistDeleteSchema };
  });

export default artistsRoutes;
