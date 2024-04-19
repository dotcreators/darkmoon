import { Hono } from "hono";
import { fetchQueuedProfiles } from "./api/scraper";
import { Enviroment } from "./env.config";
import { appendTrailingSlash } from 'hono/trailing-slash'
import { cors } from "hono/cors";
import { html } from 'hono/html'
import { CreateArtists, EditArtist, GetArtistsPaginated } from "./api/supabase";
import { FetchedUserProfile } from "./models/Fetch/FetchedUserProfile";
import { TwitterUserProfile } from "./models/Fetch/TwitterUserProfile";
import { RedisRateLimiter, isRateLimited } from "./utils/redisRateLimiter";
import { Ratelimit } from "@upstash/ratelimit";

declare module "hono" {
  interface ContextVariableMap {
    ratelimit: Ratelimit
  }
}

const app = new Hono<{ Bindings: Enviroment }>();

const cache = new Map<string, number>();
RedisRateLimiter.setCache(cache);

app.use(appendTrailingSlash());
app.use(cors({
  origin: '*',
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
  allowMethods: ['*'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));
app.use(async (c, next) => {
  const ratelimit = RedisRateLimiter.getInstance(c);
  c.set("ratelimit", ratelimit);
  await next();
});

app.get("/*", async (c) => {
  if (await isRateLimited(c)) {
    return c.json({message: 'Too many requests'}, {status: 429})
  }

  return c.html(
    html`
      <!DOCTYPE html>
        <body style='background-color: black; color: white; font-family: Consolas'>
          <p>dotpix-api-v1</p>
          <p>ratelimit: <code>60 requests per 1 min</code></p>
        </body>
      </html>
    `
  )
});

app.post("/artists/fetch/", async(c) => {
  if (await isRateLimited(c)) {
    return c.json({message: 'Too many requests'}, {status: 429})
  }
  
  try {
    const requestBody = await c.req.json<{data: string[]}>();

    if (!requestBody) {
      return c.json({ success: false, message: 'Invalid request body', error: 400 }, { status: 400 });
    }
    
    const userProfiles: string[] = requestBody.data;
    const userProfilesData = await fetchQueuedProfiles(userProfiles);
    const noErrorProfiles: TwitterUserProfile[] = userProfilesData
      .filter((data: FetchedUserProfile) => !data.hasError)
      .map((data: FetchedUserProfile) => data.profile!);
    const createdArtistsCount = await CreateArtists({
      artists: noErrorProfiles, 
      apiUrl: c.env.SUPABASE_URL, 
      apiKey: c.env.SUPABASE_KEY
    });

    return c.json({ success: true, message: 'Created profiles: ' + createdArtistsCount});
  } catch (e) {
    return c.json({ success: false, message: e instanceof Error ? e.message : e, error: 400 }, { status: 400 });
  }
});

// TODO: setup ratelimits later
app.get("/artists/", async(c) => {
  try {
    const { q, tags, country, sort, page, count} = c.req.query();

    const getArtists = await GetArtistsPaginated({
      page: Number(page), 
      count: Number(count),
      options: {
        q: q,
        tags: tags,
        country: country,
        sort: sort,
      },
      apiUrl: c.env.SUPABASE_URL, 
      apiKey: c.env.SUPABASE_KEY}
    );
    
    return c.json({ success: true, data: getArtists });
  } catch(e) {
    return c.json({ success: false, message: e instanceof Error ? e.message : e, error: 400 }, { status: 400 });
  }
});

app.delete("/artists/delete/", async(c) => {
  //...
});

// TODO: setup ratelimits later
app.patch("/artists/edit/", async(c) => {
  try {
    const { userId, username, name, tags, country, images, bio, url} = c.req.query();

    const getArtists = await EditArtist({
      userId: userId,
      edit: {
        tags: tags != undefined ? tags.split('-') : undefined,
        country: country,
        bio: bio,
        images: images ? JSON.parse(images) : undefined,
        name: name,
        url: url,
        username: username
      },
      apiUrl: c.env.SUPABASE_URL, 
      apiKey: c.env.SUPABASE_KEY
    });
    
    return c.json({ success: true, data: getArtists });
  } catch(e) {
    return c.json({ success: false, message: e instanceof Error ? e.message : e, error: 400 }, { status: 400 });
  }
});

app.post("/artists/update/", async(c) => {
  try {
    const requestBody = await c.req.json<{data: string[]}>();

    if (!requestBody) {
      return c.json({ success: false, message: 'Invalid request body', error: 400 }, { status: 400 });
    }

    // const getArtists = await UpdateArtist({
    //   userId: userId,
    //   edit: {
    //     tags: tags != undefined ? tags.split('-') : undefined,
    //     country: country,
    //     bio: bio,
    //     images: images ? JSON.parse(images) : undefined,
    //     name: name,
    //     url: url,
    //     username: username
    //   },
    //   apiUrl: c.env.SUPABASE_URL, 
    //   apiKey: c.env.SUPABASE_KEY
    // });
    
    // return c.json({ success: true, data: getArtists });
  } catch(e) {
    return c.json({ success: false, message: e instanceof Error ? e.message : e, error: 400 }, { status: 400 });
  }
});

app.get("/suggestions/", async(c) => {
  //...
});

app.patch("/suggestions/edit/", async(c) => {
  //...
});

app.post("/suggestions/create/", async(c) => {
  //...
});


export default app;