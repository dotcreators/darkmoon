import { Elysia, t } from "elysia";
import { getArtistsPaginated } from "./handlers";
import { ArtistsSearchDTO, ArtistsSearchQuery } from "../../models/query/ArtistsSearchQuery";

const artistsRoutes = new Elysia({prefix: '/artists'})
    .get('/', ({ query }) => 
        getArtistsPaginated(<ArtistsSearchQuery>query), { query: ArtistsSearchDTO })
    .get('/:artistId', ({ params: { artistId } }) => {'get artist by id'})
    .post('/', () => {'create artist'})
    .post('/many', () => {'create many artists'})
    .patch('/:artistId', ({ params: { artistId } }) => {'update artist'})
    .delete('/:artistId', ({ params: { artistId } }) => {'delete artist'})
    .delete('/many', () => {'delete artist'})