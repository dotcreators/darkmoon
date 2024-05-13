export interface SuggestionCreateRequest {
  username: string;
  avatarUrl: string;
  country?: string;
  tags?: string[];
}
