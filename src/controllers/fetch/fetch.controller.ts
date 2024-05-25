import { Scraper } from '@the-convocation/twitter-scraper';
import Elysia from 'elysia';

const _scraper = new Scraper();

const fetchRoutes = new Elysia({
  prefix: '/fetch',
  detail: {
    tags: ['Fetch'],
  },
}).get(':userTag', async ({ params: { userTag }, set }) => {
  try {
    const user = await _scraper.getProfile(userTag);
    return {
      status: 'success',
      response: {
        avatar: user.avatar,
        followers: user.followersCount,
        tweets: user.tweetsCount,
        user: {
          username: user.username,
          name: user.name,
        },
      },
    };
  } catch (e) {
    set.status = 500;
    console.log(e);
    return {
      status: 'error',
      response: e instanceof Error ? e.message : e,
    };
  }
});

export default fetchRoutes;
