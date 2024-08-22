import { Profile, Scraper } from '@the-convocation/twitter-scraper';
import { TwitterOpenApi } from 'twitter-openapi-typescript';

export class FetchServices {
  private readonly scraper = new Scraper();
  private readonly api = new TwitterOpenApi();

  async getTwitterProfile(username: string): Promise<{
    username: string;
    name?: string;
    followersCount: number;
    tweetsCount: number;
    images: {
      avatar: string;
      banner?: string;
    };
  } | null> {
    const twitterClient = await this.api.getGuestClient();
    const r = await twitterClient
      .getUserApi()
      .getUserByScreenName({ screenName: username });

    if (r && r.data && r.data.user) {
      return {
        username: r.data.user.legacy.screenName,
        name: r.data.user.legacy.name || undefined,
        followersCount: r.data.user.legacy.normalFollowersCount || 0,
        tweetsCount: r.data.user.legacy.statusesCount || 0,
        images: {
          avatar: r.data.user.legacy.profileImageUrlHttps,
          banner: r.data.user.legacy.profileBannerUrl,
        },
      };
    }

    return null;
  }
}
