export interface ArtistUpdateRequest {
  tweetsCount: number;
  followersCount: number;
}

export interface BulkArtistUpdateRequest extends ArtistUpdateRequest {
  artistId: string;
}
