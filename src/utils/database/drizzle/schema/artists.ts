import {
  integer,
  json,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const artistsTable = pgTable('artists', {
  id: uuid().primaryKey().defaultRandom(),
  twitterUserId: integer().notNull().unique(),
  username: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }),
  tweetsCount: integer().notNull(),
  followersCount: integer().notNull(),
  weeklyTweetsTrend: real().notNull().default(0),
  weeklyFollowersTrend: real().notNull().default(0),
  images: json().notNull(),
  tags: json().notNull(),
  url: text().notNull(),
  country: text(),
  website: text(),
  bio: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  joinedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const artistsSuggestionsTable = pgTable('artistsSuggestions', {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull(),
  avatarUrl: text().notNull(),
  country: text(),
  tags: json(),
  status: varchar({ length: 255 }).notNull().default('requested'),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const artistsTrendsTable = pgTable('artistsTrends', {
  id: uuid().primaryKey().defaultRandom(),
  artistId: integer().references(() => artistsTable.twitterUserId),
  tweetsCount: integer().notNull(),
  followersCount: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
