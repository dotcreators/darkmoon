import { Profile, Scraper } from "@the-convocation/twitter-scraper";
import { TwitterUserProfile } from "../models/Fetch/TwitterUserProfile";
import { FetchedUserProfile } from "../models/Fetch/FetchedUserProfile";

const _scraper = new Scraper();

async function scrapProfile(username: string): Promise<TwitterUserProfile | undefined> {
    try {
        const user: Profile = await _scraper.getProfile(username);
        
        if (user && user.username && user.userId && user.joined && user.tweetsCount
            && user.followersCount && user.followingCount && user.url && user.avatar) {
            const _redefinedUserProfile: TwitterUserProfile = {
                name: user.name,
                username: user.username,
                userId: user.userId,
                joinedAt: user.joined,
                tweetsCount: user.tweetsCount,
                followersCount: user.followersCount,
                url: user.url,
                images: {
                    avatar: user.avatar,
                    banner: user.banner
                },
                website: user.website,
                bio: user.biography 
            };
            
            return _redefinedUserProfile;
        } else {
            return undefined;
        }
    } catch (e: unknown) {
        console.error(`Error while trying to get user profile: ${e instanceof Error ? e.message : 'no error message'}`);
        return undefined;
    }
} 

export async function fetchQueuedProfiles(usernames: string[]): Promise<FetchedUserProfile[]> {
    const _profiles: FetchedUserProfile[] = [];

    for (let i = 0; i < usernames.length; i++) {
        const username = usernames[i];
        console.log(`[${i + 1}/${usernames.length}][INFO]: Start fetching ${username}...`);

        try {
            const _userProfile = await scrapProfile(username);

            if (_userProfile) {
                console.log(`[${i + 1}/${usernames.length}][INFO]: Profile fetched for ${username}.`);
                _profiles.push({
                    profile: _userProfile,
                    username: username,
                    hasError: false
                });
            } else {
                console.log(`[${i + 1}/${usernames.length}][INFO]: Error fetching profile for ${username}, skipping...`);
                _profiles.push({
                    profile: undefined,
                    username: username,
                    hasError: true
                });
            }
        } catch (e) {
            console.log(`[${i + 1}/${usernames.length}][INFO]: Error fetching profile for ${username}, skipping...`);
            _profiles.push({
                profile: undefined,
                username: username,
                hasError: true
            });
        }
    }

    console.log(`[INFO]: Fetching ended with a total of ${_profiles.length} user profiles.`);
    return _profiles;
}