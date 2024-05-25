import { Query } from "../Query";

export interface SuggestionRequest extends Query {
  requestStatus: string;
}
