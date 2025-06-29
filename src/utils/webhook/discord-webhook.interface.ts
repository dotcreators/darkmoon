export interface IDiscordWebhook {
  sendErrorMessage(title: string, message: string): void;
  sendLogMessage(title: string, message: string): void;
  sendArtistSuggestion(
    username: string,
    avatarUrl: string,
    tags: string[] | undefined,
    country: string | undefined
  ): void;
}
