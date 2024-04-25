import { Query } from "./Query";

export interface ArtistsSearchQuery extends Query {
  username?: string;
  country?: string;
  tags?: string[];
  sortBy?: string;
}
