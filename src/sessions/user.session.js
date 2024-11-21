import { cacheUserSession } from '../db/Account/account.redis.js';
import { removeUserQueue } from '../utils/socket/messageQueue.js';
import { userSessions } from './sessions.js';

export const addUserSession = async (socket, dbId, userName, token, expirationTime) => {
  const sessionData = {
    socket,
    id: dbId,
    userName,
    expirationTime,
    token,
  };
  //이중 데이터 저장이 아닌 참조로 키값만 이중화함
  //토큰은 문자열, dbId는 고유한 번호기에 가능하다 봅니다.
  userSessions[token] = sessionData;
  userSessions[dbId] = sessionData;
  return await cacheUserSession(dbId, token, expirationTime);
};

export const removeUserSession = (token) => {
  if (userSessions[token]) {
    removeUserQueue(userSessions[token].socket);
    delete userSessions[token];
    delete userSessions[userSessions[token].id];
  }
};

export const getUserByToken = (token) => {
  return userSessions[token];
};

export const getUserByDBid = (dbId) => {
  return userSessions[dbId];
};
