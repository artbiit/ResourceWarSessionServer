import { createPacket } from '../response/createPacket.js';
const makeNotification = (packetType, user, payload) => {
  return createPacket(packetType, user, payload);
};

export default makeNotification;
