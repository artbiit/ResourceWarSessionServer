import logger from '../utils/logger.js';
import { removeUserQueue } from '../utils/socket/messageQueue.js';

export const onEnd = (socket) => () => {
  removeUserQueue(socket);
  logger.info(`클라이언트 연결이 종료되었습니다. : ${socket?.id}`);
};
