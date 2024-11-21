import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';
import logger from '../utils/logger.js';
import { addUserQueue } from '../utils/socket/messageQueue.js';
import { v4 as uuidv4 } from 'uuid';

export const onConnection = (socket) => {
  socket.id = uuidv4();
  logger.info(`클라이언트가 연결되었습니다: ${socket.id}`);
  socket.errorCount = 0;
  socket.buffer = Buffer.alloc(0);

  addUserQueue(socket);
  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
