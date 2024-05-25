export interface ArtistProfile {
  id: string;
  username: string;
  userId: string;
  tweetsCount: number;
  followersCount: number;
  images: {
    avatar: string | undefined;
    banner: string | undefined;
  };
  tags: string[];
  url: string;
  joinedAt: Date;
  createdAt: Date;
  lastUpdatedAt: Date;
  name: string | undefined;
  country: string | undefined;
  bio: string | undefined;
  website: string | undefined;
}
