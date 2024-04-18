import { TwitterUserProfile } from "./TwitterUserProfile";

export interface FetchedUserProfile { 
    profile: TwitterUserProfile | undefined, 
    username: string, 
    hasError: boolean 
}