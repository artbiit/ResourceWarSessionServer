//import { removeUser } from '../session/user.session.js';

import { removeUserSession } from '../sessions/user.session.js';
import logger from '../utils/logger.js';

export const onError = (socket) => (err) => {
  removeUserSession(socket);
  logger.error(`소켓 오류: ${socket?.id}\n`, err);
};
