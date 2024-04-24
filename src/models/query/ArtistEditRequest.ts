import { t } from "elysia";

export interface ArtistEditRequest {
  username?: string;
  name?: string;
  tags?: string[];
  country?: string;
  images?: {
    avatar?: string;
    banner?: string;
  };
  bio?: string;
  url?: string;
}

export const ArtistEditDTO = t.Partial(
  t.Object({
    username: t.String(),
    name: t.String(),
    tags: t.Array(t.String(), { minItems: 1 }),
    country: t.String(),
    images: t.Object({
      avatar: t.String(),
      banner: t.String(),
    }),
    bio: t.String(),
    url: t.String(),
  }),
);
