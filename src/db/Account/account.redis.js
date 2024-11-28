import { getRedis } from '../redis.js';
const USER_SESSION_KEY = 'UserSession';

const redis = await getRedis();
export const cacheUserSession = async (dbId, token, expirationTime) => {
  return await redis.hset(`${USER_SESSION_KEY}:${token}`, {
    token,
    expirationTime,
    id: dbId,
  });
};

export const unlinkUserSession = async (token) => {
  const redis = await getRedis();
  return await redis.unlink(`${USER_SESSION_KEY}:${token}`);
};

export const getUserSession = async (token) => {
  const redis = await getRedis();
  const result = await redis.hgetall(`${USER_SESSION_KEY}:${token}`);
  return Object.keys(result).length === 0 ? null : result;
};
