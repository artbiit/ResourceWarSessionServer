import { removeUserQueue } from '../utils/socket/messageQueue.js';
import { userSessions } from './sessions.js';

export const addUserSession = (socket, userInfo) => {
  userSessions[socket] = userInfo;
  console.log(userSessions);
};

export const removeUserSession = (socket) => {
  removeUserQueue(socket);
  if (userSessions[socket]) {
    delete userSessions.socket;
  }
};
