const { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook(process.env.WEBHOOK_URL);
const suggestionHook = new Webhook(process.env.SUGGESTION_WEBHOOK_URL);
hook.setUsername('dotcreator');

export function sendDiscordMessage(
  title: string,
  message: string,
  severity: 'error' | 'info'
) {
  let embed: any = {};

  if (severity === 'error') {
    embed = new MessageBuilder()
      .setColor('#FA4545')
      .setTitle(`darkmoon-${title.toLocaleLowerCase()}`)
      .setDescription(message)
      .setTimestamp();
  } else if (severity === 'info') {
    embed = new MessageBuilder()
      .setColor('#FF902B')
      .setTitle(title)
      .setDescription(message)
      .setTimestamp();
  }

  hook.send(embed);
}

export function sendDiscordMessageSuggestion(
  username: string,
  avatarUrl: string,
  tags: string[] | undefined,
  country: string | undefined
) {
  let embed = new MessageBuilder()
    .setColor('#FF902B')
    .setTitle(username)
    .setURL(
      'https://dashboard.dotcreators.xyz/dashboard/suggestions?page=1&limit=50&requestStatus=suggested'
    )
    .setThumbnail(avatarUrl)
    .addField('Tags', tags ? tags.join(', ') : 'null', true)
    .addField('Country', country ?? 'null')
    .setTimestamp();

  suggestionHook.send(embed);
}
