import { Profile, Scraper } from '@the-convocation/twitter-scraper';

export class FetchServices {
  private readonly scraper = new Scraper();

  async getTwitterProfile(username: string): Promise<{
    username: string;
    name?: string;
    followersCount: number;
    tweetsCount: number;
    images: {
      avatar: string;
      banner?: string;
    };
  }> {
    const profile = await this.scraper.getProfile(username);

    return {
      username: profile.username || username,
      name: profile.name || undefined,
      followersCount: profile.followersCount || 0,
      tweetsCount: profile.tweetsCount || 0,
      images: {
        avatar: profile.avatar!,
        banner: profile.banner,
      },
    };
  }
}
