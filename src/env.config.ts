import 'dotenv/config';

export const envConfig = {
  IS_DEVELOPMENT: process.env['DEV'] === 'true',
  ADMIN_API_TOKEN: process.env['ADMIN_API_TOKEN'] ?? '',
};
