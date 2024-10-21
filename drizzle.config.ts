import { defineConfig } from 'drizzle-kit';
import { drizzleConfig } from './src/utils/database/drizzle/drizzle.config';

export default defineConfig({
  out: './drizzle',
  schema: './src/utils/database/drizzle/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: drizzleConfig.DATABASE_CONNECTION_URL,
  },
});
