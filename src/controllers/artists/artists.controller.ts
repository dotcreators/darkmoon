import { Elysia } from "elysia";
import {
  ArtistsSearchDTO,
  ArtistsSearchQuery,
} from "../../models/query/ArtistsSearchQuery";
import {
  ArtistEditDTO,
  ArtistEditRequest,
} from "../../models/query/ArtistEditRequest";
import {
  ArtistUpdateDTO,
  ArtistUpdateRequest,
  BulkArtistUpdateDTO,
} from "../../models/query/ArtistsUpdateRequest";
import { BulkArtistDeleteDTO } from "../../models/query/ArtistsDeleteRequest";
import { ArtistsServices } from "./artists.services";

const artistsServices: ArtistsServices = new ArtistsServices();

const artistsRoutes = new Elysia({ prefix: "/artists" })
  .get(
    "/",
    ({ query }) =>
      artistsServices.getArtistsPaginated(<ArtistsSearchQuery>query),
    {
      query: ArtistsSearchDTO,
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
      query: ArtistEditDTO,
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
    { query: ArtistUpdateDTO },
  )
  .patch(
    "/stats/bulk",
    ({ body }) =>
      artistsServices.bulkUpdateArtistsStats(<ArtistUpdateRequest[]>body),
    { body: BulkArtistUpdateDTO },
  )
  .delete("/:artistId", ({ params: { artistId } }) => {
    artistsServices.deleteArtist(artistId);
  })
  .delete("/bulk", ({ body }) => {
    artistsServices.bulkDeleteArtists(<string[]>body),
      { body: BulkArtistDeleteDTO };
  });

export default artistsRoutes;
