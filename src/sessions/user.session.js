import { removeUserQueue } from '../utils/socket/messageQueue.js';
import { userSessions } from './sessions.js';

export const addUserSession = (socket, id, userName, token, expirationTime) => {
  userSessions[socket.id] = {
    socket,
    userInfo: {
      id,
      userName,
      token,
      expirationTime,
    },
  };
};

export const removeUserSession = (socket) => {
  removeUserQueue(socket);
  delete userSessions[socket.id];
};
