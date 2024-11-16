import { createPacket } from '../response/createPacket.js';
const makeNotification = (packetType, token = '', payload) => {
  return createPacket(packetType, token, payload);
};

export default makeNotification;
