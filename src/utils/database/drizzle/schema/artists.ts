import {
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
  customType,
} from 'drizzle-orm/pg-core';

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

export const artists = pgTable('artists', {
  id: uuid('id').primaryKey().defaultRandom(),
  twitterUserId: text('twitter_user_id').notNull().unique(),
  username: varchar('username', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  tweetsCount: integer('tweets_count').notNull(),
  followersCount: integer('followers_count').notNull(),
  weeklyTweetsTrend: real('weekly_tweets_trend').notNull().default(0),
  weeklyFollowersTrend: real('weekly_followers_trend').notNull().default(0),
  images: typedJsonb<Images>('images').notNull(),
  tags: typedJsonb<Tags>('tags'),
  url: text('url').notNull(),
  country: text('country'),
  website: text('website'),
  bio: text('bio'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  joinedAt: timestamp('joinedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const artistsSuggestions = pgTable('artistsSuggestions', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url').notNull(),
  country: text('country'),
  tags: typedJsonb<Tags>('tags'),
  status: varchar('status', { length: 255 }).notNull().default('requested'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const artistsTrends = pgTable('artistsTrends', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: text('artist_id').references(() => artists.twitterUserId),
  tweetsCount: integer('tweets_count').notNull(),
  followersCount: integer('followers_count').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
