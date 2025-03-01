import { Static } from 'elysia';
import { SuggestionsQueryModel } from './suggestions.query';
import { SuggestionsResponseModel } from './suggestions.response';

export type GetSuggestionsQuery = Static<typeof SuggestionsQueryModel.GetSuggestions>;
export type GetSuggestionsResponse = Static<typeof SuggestionsResponseModel.GetSuggestions>;
