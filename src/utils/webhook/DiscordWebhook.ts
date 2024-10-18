import { EmbedBuilder } from '@tycrek/discord-hookr';
import { Webhook } from '@tycrek/discord-hookr/dist/webhook';

export class DiscordWebhook {
  private errorHook: Webhook;
  private logHook: Webhook;
  private suggestionHook: Webhook;

  constructor() {
    this.errorHook = new Webhook(process.env.ERROR_WEBHOOK_URL ?? '');
    this.logHook = new Webhook(process.env.LOG_WEBHOOK_URL ?? '');
    this.suggestionHook = new Webhook(process.env.SUGGESTION_WEBHOOK_URL ?? '');
  }

  public sendErrorMessage(title: string, message: string): void {
    const embed = new EmbedBuilder()
      .setColor('#FA4545')
      .setTitle(`darkmoon-api throw error: ${title.toLocaleLowerCase()}`)
      .setDescription(message)
      .setTimestamp();

    this.errorHook.addEmbed(embed);
    this.errorHook.send();
  }

  public sendLogMessage(title: string, message: string): void {
    const embed = new EmbedBuilder()
      .setColor('#FF902B')
      .setTitle(title)
      .setDescription(message)
      .setTimestamp();

    this.logHook.addEmbed(embed);
    this.logHook.send();
  }

  public sendArtistSuggestion(
    username: string,
    avatarUrl: string,
    tags: string[] | undefined,
    country: string | undefined
  ) {
    const embed = new EmbedBuilder()
      .setColor('#FF902B')
      .setTitle(username)
      .setURL(
        'https://dashboard.dotcreators.xyz/dashboard/suggestions?page=1&limit=50&requestStatus=suggested'
      )
      .setThumbnail({ url: avatarUrl })
      .addField({
        name: 'Tags',
        value: tags
          ? tags
              .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1))
              .join(', ')
          : 'Tags not provided',
        inline: true,
      })
      .addField({
        name: 'Country',
        value: country ?? 'Country not provided',
        inline: true,
      })
      .setTimestamp();

    this.suggestionHook.addEmbed(embed);
    this.suggestionHook.send();
  }
}
