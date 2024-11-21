import { getRedis } from '../redis.js';
import configs from '../../configs/configs.js';
import logger from '../../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

const { REDIS_MATCH_REQUEST_CHANNEL } = configs;
/**매치메이킹 대기열 키*/
const WAITING_KEY = `match_queue_${uuidv4()}`;
/**매치메이킹 등록 함수 */
export const enqueueMatchMaking = async (token) => {
  if (!token) {
    throw new Error('userId must be defined');
  }

  const redis = await getRedis();
  await redis.rpush(WAITING_KEY, token);
  redis.publish(REDIS_MATCH_REQUEST_CHANNEL, token);
};

/** 대기열 인원 수 반환 */
export const getQueueCount = async () => {
  const redis = await getRedis();
  const queueLength = await redis.llen(WAITING_KEY);
  return queueLength;
};

/**
 * 대기열에서 첫 번째 데이터를 가져옴 (삭제 없이)
 */
export const getLobby = async (index) => {
  const redis = await getRedis();
  const gameCode = await redis.lindex(WAITING_KEY, index); // 첫 번째 인덱스 값 조회
  if (!gameCode) {
    logger.warn('getLobby. Waiting queue is empty');
    return null;
  }
  return gameCode;
};

/**
 * 대기열에서 특정 데이터를 삭제
 * @param {string} gameCode 삭제할 토큰 값
 */
export const removeMatchMaking = async (gameCode) => {
  if (!gameCode) {
    throw new Error('gameCode must be defined');
  }

  const redis = await getRedis();
  const result = await redis.lrem(WAITING_KEY, 0, gameCode); // 리스트에서 해당 값 제거
  if (result === 0) {
    logger.warn(`removeMatchMaking. gameCode not found: ${gameCode}`);
    return false; // 삭제된 데이터 없음
  }

  return true; // 성공적으로 삭제됨
};
