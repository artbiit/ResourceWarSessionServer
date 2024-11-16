import { removeUserQueue } from '../utils/socket/messageQueue.js';

export const addUserSession = (socket) => {};

export const removeUserSession = (socket) => {
  removeUserQueue(socket);
};
