import { getRedis } from '../redis.js';

const GAME_SESSION_KEY = 'GameSession';
const ALIVE_GAMESSESIONS_KEY = 'GameSessions';
const LOBBY_QUEUE_KEY = 'Lobby';
export const trySetGameSession = async (gameCode, gameInfo) => {
  const redis = await getRedis();
  const redisKey = `${GAME_SESSION_KEY}:${gameCode}`;
  let result = true;
  const exists = await redis.exists(redisKey);
  if (!exists) {
    await redis.hset(redisKey, gameInfo);
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

/**
 * 게임 코드에 해당하는 세션 정보를 가져옵니다.
 * @param {string} gameCode - 조회할 게임 코드
 * @returns {Promise<Object|null>} 세션 정보 또는 null
 */
export const getGameSession = async (gameCode) => {
  const redis = await getRedis();
  const redisKey = `${GAME_SESSION_KEY}:${gameCode}`;

  const sessionData = await redis.hgetall(redisKey);

  if (Object.keys(sessionData).length === 0) {
    return null;
  }

  sessionData.previousPlayer = parseInt(sessionData.previousPlayer, 10) || 0;
  sessionData.currentPlayer = parseInt(sessionData.currentPlayer, 10) || 0;
  sessionData.maxPlayer = parseInt(sessionData.maxPlayer, 10) || 4;

  return sessionData;
};

export const increasePreviousPlayer = async (gameCode) => {
  const redis = await getRedis();
  const redisKey = `${GAME_SESSION_KEY}:${gameCode}`;

  const exists = await redis.exists(redisKey);
  if (!exists) {
    throw new Error(`Game session with code ${gameCode} does not exist.`);
  }

  // Get the current value of 'previousPlayer' and increment it
  const previousPlayer = await redis.hget(redisKey, 'previousPlayer');
  const updatedPlayerCount = (parseInt(previousPlayer, 10) || 0) + 1;

  // Save the updated value back to Redis
  await redis.hset(redisKey, 'previousPlayer', updatedPlayerCount);

  return updatedPlayerCount;
};
