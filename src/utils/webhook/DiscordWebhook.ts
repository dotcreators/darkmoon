import { EmbedBuilder } from '@tycrek/discord-hookr';
import { Webhook } from '@tycrek/discord-hookr/dist/webhook';
import { IDiscordWebhook } from './discordWebhook.interface';
import { webhookConfig } from './webhook.config';

export class DiscordWebhook implements IDiscordWebhook {
  private errorHook: Webhook;
  private logHook: Webhook;
  private suggestionHook: Webhook;

  constructor() {
    this.errorHook = new Webhook(webhookConfig.errorWebhookUrl);
    this.logHook = new Webhook(webhookConfig.logWebhookUrl);
    this.suggestionHook = new Webhook(webhookConfig.suggestionWebhookUrl);
  }

  public sendErrorMessage(title: string, message: string): void {
    const embed = new EmbedBuilder()
      .setColor('#FA4545')
      .setTitle(`darkmoon-api throw error: ${title.toLocaleLowerCase()}`)
      .setDescription(message)
      .setTimestamp();

    this.errorHook.addEmbed(embed);
    this.errorHook.send().catch(e => {
      console.log('Error while trying to send discord message: ', e);
    });
  }

  public sendLogMessage(title: string, message: string): void {
    const embed = new EmbedBuilder()
      .setColor('#FF902B')
      .setTitle(title)
      .setDescription(message)
      .setTimestamp();

    this.logHook.addEmbed(embed);
    this.logHook.send().catch(e => {
      console.log('Error while trying to send discord message: ', e);
    });
  }

  public sendArtistSuggestion(
    username: string,
    avatarUrl: string,
    tags: string[] | undefined,
    country: string | undefined
  ): void {
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
    this.suggestionHook.send().catch(e => {
      console.log('Error while trying to send discord message: ', e);
    });
  }
}
