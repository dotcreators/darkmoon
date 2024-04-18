import { TwitterUserProfile } from "./Fetch/TwitterUserProfile";

export interface ArtistProfile extends TwitterUserProfile {
    id: string,
    lastUpdateAt: Date,
    createdAt: Date,
    country: string,
    tags: string[],
}