import { TwitterUserProfile } from "./Fetch/TwitterUserProfile";

export interface ArtistCreateQuery {
    artists: TwitterUserProfile[],
    apiUrl: string,
    apiKey: string
}