import { getRedis } from '../redis.js';

const GAMESESSION_KEY = 'GameSession';
const ALIVE_GAMESSESIONS_KEY = 'GameSessions';
const LOBBY_QUEUE_KEY = 'Lobby';
export const trySetGameSession = async (gameCode) => {
  const redis = await getRedis();
  const redisKey = `${GAMESESSION_KEY}:${gameCode}`;
  const isSet = await redis.setnx(redisKey, 1);
  let result = true;
  if (isSet) {
    await redis.expire(redisKey, 3600);
  } else {
    result = false;
  }
  return result;
};

export const registNewLobby = async (gameCode, isPrivate) => {
  const redis = await getRedis();
  const multi = redis.multi();

  multi.rpush(ALIVE_GAMESSESIONS_KEY, gameCode);
  if (isPrivate) {
    multi.lpush(LOBBY_QUEUE_KEY, gameCode);
  }
  return await multi.exec();
};
