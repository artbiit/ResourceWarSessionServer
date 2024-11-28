import { getUserByToken } from '../../sessions/user.session.js';
import logger from '../logger.js';
import { createPacket } from '../response/createPacket.js';
import { enqueueSend } from '../socket/messageQueue.js';
const makeNotification = (packetType, token = '', payload, targetTokens) => {
  if (!targetTokens || !Array.isArray(targetTokens)) {
    throw new Error(`Invalid targetTokens : ${targetTokens}`);
  }

  const packet = createPacket(packetType, token, payload);

  for (let token of targetTokens) {
    const user = getUserByToken(token);
    if (user) {
      enqueueSend(user.socket.id, packet);
    } else {
      logger.error(`makeNotification. packetType[${packetType}]. could not found : ${token}`);
    }
  }
};

export default makeNotification;
