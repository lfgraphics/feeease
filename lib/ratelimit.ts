import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Create a new ratelimiter, that allows 20 requests per 10 seconds
// Using a sliding window algorithm
export const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
    token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
  }),
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  ephemeralCache: new Map(),
  analytics: true,
  prefix: "@upstash/ratelimit",
});
