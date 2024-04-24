import { t } from "elysia";
import { Query } from "./Query";

export interface ArtistsSearchQuery extends Query {
  username?: string;
  country?: string;
  tags?: string[];
  sortBy?: string;
}

export const ArtistsSearchDTO = t.Object({
  page: t.Numeric(),
  limit: t.Numeric(),
  username: t.Optional(t.String()),
  country: t.Optional(t.String()),
  tags: t.Optional(t.Array(t.String(), { minItems: 1 })),
  sortBy: t.Optional(t.String()),
});
