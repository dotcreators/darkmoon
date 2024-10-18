export const webhookConfig = {
  errorWebhookUrl: process.env.ERROR_WEBHOOK_URL || '',
  logWebhookUrl: process.env.LOG_WEBHOOK_URL || '',
  suggestionWebhookUrl: process.env.SUGGESTION_WEBHOOK_URL || '',
};
