import { t } from 'elysia';

export const suggestionsResponses = {
  'suggestions.get': t.Object({}),
  'suggestions.create': t.Object({}),
  'suggestions.createBulk': t.Object({}),
  'suggestions.update': t.Object({}),
};

export interface SuggestionsResponsesModel {
  suggestions: {
    create: {};
    createBulk: {};
    get: {};
    update: {};
  };
}
