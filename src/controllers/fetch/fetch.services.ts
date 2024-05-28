import { Profile, Scraper } from '@the-convocation/twitter-scraper';

export class FetchServices {
  private readonly scraper = new Scraper();

  async getTwitterProfile(userTag: string): Promise<Profile> {
    return await this.scraper.getProfile(userTag);
  }
}
