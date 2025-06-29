import 'dotenv/config';

export const envConfig = {
  IS_DEVELOPMENT: process.env['DEV'] === 'true',
};
