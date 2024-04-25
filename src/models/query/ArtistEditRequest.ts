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
