import { cacheUserSession } from '../db/Account/account.redis.js';
import { removeUserQueue } from '../utils/socket/messageQueue.js';
import { userSessions } from './sessions.js';

export const addUserSession = async (socket, dbId, userName, token, expirationTime) => {
  userSessions[token] = {
    socket,
    userInfo: {
      id: dbId,
      userName,
      expirationTime,
    },
  };
  return await cacheUserSession(dbId, token, expirationTime);
};

export const removeUserSession = (socket) => {
  removeUserQueue(socket);
  delete userSessions[socket.id];
};

export const getUser = (token) => {
  return userSessions[token];
};
