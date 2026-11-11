import { integer, pgTable, text, timestamp, uuid, varchar, customType, boolean } from 'drizzle-orm/pg-core';

type Tags = { items: string[] };
type Images = { avatar: string; banner?: string };

const typedJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return 'jsonb';
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
  })(name);

const finiteReal = customType<{ data: number; driverData: number | string }>({
  dataType() {
    return 'real';
  },
  fromDriver(value): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  },
});

export const artists = pgTable('artists', {
  id: uuid('id').primaryKey().defaultRandom(),
  twitterUserId: text('twitter_user_id').notNull().unique(),
  username: varchar('username', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  tweetsCount: integer('tweets_count').notNull(),
  followersCount: integer('followers_count').notNull(),
  weeklyTweetsTrend: finiteReal('weekly_tweets_trend').notNull().default(0),
  weeklyFollowersTrend: finiteReal('weekly_followers_trend').notNull().default(0),
  images: typedJsonb<Images>('images').notNull(),
  tags: text('tags').array().notNull(),
  url: text('url').notNull(),
  country: text('country'),
  website: text('website'),
  bio: text('bio'),
  isEnabled: boolean('is_enabled').notNull().default(true),
  ranking: integer('ranking').notNull().default(0),
  previousRanking: integer('previous_ranking').notNull().default(0),
  rankingChange: integer('ranking_change').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const artistsSuggestions = pgTable('artistsSuggestions', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url').notNull(),
  country: text('country'),
  tags: text('tags').array().notNull(),
  status: varchar('status', { length: 255 }).notNull().default('requested'),
  requestedFrom: text('requested_from').notNull().default('suggestions'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const artistsTrends = pgTable('artistsTrends', {
  id: uuid('id').primaryKey().defaultRandom(),
  twitterUserId: text('artist_id')
    .references(() => artists.twitterUserId)
    .notNull(),
  tweetsCount: integer('tweets_count').notNull(),
  followersCount: integer('followers_count').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
