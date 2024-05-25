export interface ArtistCreateRequest {
  username: string;
  userId: string;
  followersCount: number;
  tweetsCount: number;
  images: {
    avatar: string | null;
    banner: string | null;
  };
  url: string;
  joinedAt: Date;
  name: string | null;
  bio: string | null;
  website: string | null;
}
