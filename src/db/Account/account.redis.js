import { getRedis } from '../redis.js';
const USER_SESSION_KEY = 'UserSession';

export const cacheUserToken = async (id, token, expirationTime) => {
  const redis = await getRedis();
  return await redis.hset(`${USER_SESSION_KEY}:${id}`, {
    token,
    expirationTime,
  });
};

export const unlinkUserToken = async (id) => {
  const redis = await getRedis();
  return await redis.unlink(`${USER_SESSION_KEY}:${id}`);
};
