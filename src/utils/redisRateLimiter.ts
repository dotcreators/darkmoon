import { Ratelimit } from "@upstash/ratelimit";
import { BlankInput, Next } from "hono/types";
import { Context } from "hono";
import { Enviroment } from "../env.config";
import { Redis } from "@upstash/redis/cloudflare";

export class RedisRateLimiter {
    static instance: Ratelimit;
    static cache: Map<string, number>;
  
    static setCache(cache: Map<string, number>) {
        this.cache = cache;
    }

    static getInstance(c: Context<{ Bindings: Enviroment }, "/api/", BlankInput>) {
        if (!this.instance) {
            const redisClient = new Redis({
                token: c.env.REDIS_TOKEN,
                url: c.env.REDIS_URL,
            });

            const ratelimit = new Ratelimit({
                redis: redisClient,
                limiter: Ratelimit.slidingWindow(60, "1 m"),
                ephemeralCache: this.cache
            });

            this.instance = ratelimit;
            return this.instance;
        } else {
            return this.instance;
        }
    }
}

export const isRateLimited = async (c: Context<{ Bindings: Enviroment }, "/api/", BlankInput>): Promise<boolean> => {
    const ratelimit = c.get("ratelimit");
    const ip = c.req.raw.headers.get("CF-Connecting-IP");
  
    const { success} = await ratelimit.limit(ip ?? "anonymous");
  
    if (!success) return true;
    else return false;
}