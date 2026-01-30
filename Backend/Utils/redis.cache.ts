import { redisClient } from "../Redis/init.redis.js";

const DEFAULT_EXPIRATION = 3600; // 1 hour

export const getCache = async (key: string) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key: string, data: any, expiration = DEFAULT_EXPIRATION) => {
  await redisClient.setex(key, expiration, JSON.stringify(data));
};

export const deleteCache = async (...keys: string[]) => {
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }
};

export const deleteCachePattern = async (pattern: string) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }
};
