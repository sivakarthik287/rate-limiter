const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const { getConfig } = require("./configStore");

// Create Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL
});
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => {
  console.log("Redis client connected");
});
function createLimiter() {
  const cfg = getConfig();
  return new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: cfg.points,
    duration: cfg.duration,
    blockDuration: cfg.blockDuration,
  });
}

module.exports = { createLimiter, redisClient };