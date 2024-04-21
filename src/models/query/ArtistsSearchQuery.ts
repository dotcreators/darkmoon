import { t } from "elysia";

export interface ArtistsSearchQuery {
    page: number,
    limit: number,
    username?: string,
    country?: string,
    tags?: string[],
    sortBy?: string,
}

export const ArtistsSearchDTO = t.Object({
    page: t.Number(),
    limit: t.Number(),
    username: t.Optional(t.String()),
    country: t.Optional(t.String()),
    tags: t.Optional(t.Array(t.String())),
    sortBy: t.Optional(t.String()),
});