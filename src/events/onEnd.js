import { removeUserSession } from '../sessions/user.session.js';
import logger from '../utils/logger.js';

export const onEnd = (socket) => () => {
  removeUserSession(socket);
  logger.info(`클라이언트 연결이 종료되었습니다. : ${socket?.id}`);
};
