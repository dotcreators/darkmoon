import { Elysia, t } from "elysia";
import { editArtist, getArtistsPaginated } from "./handlers";
import { ArtistsSearchDTO, ArtistsSearchQuery } from "../../models/query/ArtistsSearchQuery";
import { ArtistEditDTO, ArtistEditQuery } from "../../models/query/ArtistEditQuery";

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
    .patch('/:artistId', ({ params: { artistId }, query }) => 
        editArtist(artistId, <ArtistEditQuery>query), {
            query: ArtistEditDTO,
            transform({ query }) {
                if (typeof query.tags === 'string') {
                    query.tags = [query.tags];
                }
            },
            beforeHandle({ query, error, params: { artistId } }) {
                if (Object.keys(query).length == 0) return error('Bad Request', 'Specify at least 1 of user edit options are represented!');
            }
        })
    // .post('/', () => {'create artist'})
    // .post('/many', () => {'create many artists'})
    // .patch('/:artistId', ({ params: { artistId } }) => {'update artist'})
    // .delete('/:artistId', ({ params: { artistId } }) => {'delete artist'})
    // .delete('/many', () => {'delete artist'});

export default artistsRoutes;