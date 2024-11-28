import { getRedis } from '../redis.js';
const USER_SESSION_KEY = 'UserSession';

const redis = await getRedis();
export const cacheUserSession = async (dbId, token, expirationTime, nickname) => {
  const ttl = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000) + 300); // TTL 계산 (초 단위), 5분 추가
  const key = `${USER_SESSION_KEY}:${token}`;

  // MULTI 명령어를 사용하여 트랜잭션 처리
  const multi = redis.multi();

  // 세션 데이터 저장
  multi.hset(key, {
    token,
    expirationTime,
    id: dbId,
    nickname,
  });

  // TTL 설정
  if (ttl > 0) {
    multi.expire(key, ttl);
  }

  // EXEC로 트랜잭션 실행
  await multi.exec();

  return true;
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
