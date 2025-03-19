import 'dotenv/config';

export const envConfig = {
  IS_DEVELOPMENT: Boolean(process.env.DEV) ?? false,
  ADMIN: {
    EMAIL: process.env.DEV_EMAIL || '',
    PASSWORD: process.env.DEV_PASSWORD || '',
  },
};
