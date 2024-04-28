import { Query } from "../Query";

export interface ArtistSearchRequest extends Query {
  username?: string;
  country?: string;
  tags?: string[];
  sortBy?: string;
}
