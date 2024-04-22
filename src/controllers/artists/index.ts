import { Elysia, t } from "elysia";
import { getArtistsPaginated } from "./handlers";
import { ArtistsSearchDTO, ArtistsSearchQuery } from "../../models/query/ArtistsSearchQuery";

const artistsRoutes = new Elysia({prefix: '/artists'})
    .get('/', ({ query }) => 
        getArtistsPaginated(<ArtistsSearchQuery>query), { 
            query: ArtistsSearchDTO,
            transform({ query }) {
                if (typeof query.tags === 'string') {
                    query.tags = [query.tags];
                }
            },
            beforeHandle({ query, error }) {
                if (query.limit > 100) return error('Bad Request', 'Maximum artists query limit is 100!');
            }
        })
    .get('/:artistId', ({ params: { artistId } }) => {'get artist by id'})
    .post('/', () => {'create artist'})
    .post('/many', () => {'create many artists'})
    .patch('/:artistId', ({ params: { artistId } }) => {'update artist'})
    .delete('/:artistId', ({ params: { artistId } }) => {'delete artist'})
    .delete('/many', () => {'delete artist'});

export default artistsRoutes;