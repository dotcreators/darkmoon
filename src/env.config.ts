export const envConfig = {
  IS_DEVELOPMENT: process.env.IS_DEV ? JSON.parse(process.env.IS_DEV) : false,
  ADMIN: {
    EMAIL: process.env.DEV_EMAIL || '',
    PASSWORD: process.env.DEV_PASSWORD || '',
  },
};
