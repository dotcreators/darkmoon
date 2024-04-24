import { t } from "elysia";
import { Query } from "./Query";

export interface ArtistUpdateRequest {
  tweetsCount: number;
  followersCount: number;
}

export interface BulkArtistUpdateRequest extends ArtistUpdateRequest {
  artistId: string;
}

export const ArtistUpdateDTO = t.Object({
  artistId: t.String(),
  tweetsCount: t.Numeric(),
  followersCount: t.Numeric(),
});

export const BulkArtistUpdateDTO = t.Array(
  t.Object({
    artistId: t.String(),
    tweetsCount: t.Numeric(),
    followersCount: t.Numeric(),
  }),
);
