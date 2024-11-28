import logger from '../utils/logger.js';
import { removeUserQueue } from '../utils/socket/messageQueue.js';

export const onError = (socket) => (err) => {
  removeUserQueue(socket);
  logger.error(`소켓 오류: ${socket?.id}\n`, err);
};
