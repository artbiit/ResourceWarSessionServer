import { cacheUserSession } from '../db/Account/account.redis.js';
import { removeUserQueue } from '../utils/socket/messageQueue.js';
import { userSessions } from './sessions.js';

export const addUserSession = async (socket, id, userName, token, expirationTime) => {
  userSessions[socket.id] = {
    socket,
    userInfo: {
      id,
      userName,
      token,
      expirationTime,
    },
  };
  return await cacheUserSession(id, token, expirationTime);
};

export const removeUserSession = (socket) => {
  removeUserQueue(socket);
  delete userSessions[socket.id];
};

export const getUserBySocket = (socket) => {
  return userSessions[socket.id];
};

export const getUserBySocketId = (socketId) => {
  return userSessions[socketId];
};
