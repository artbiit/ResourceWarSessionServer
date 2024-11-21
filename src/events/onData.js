import configs from '../configs/configs.js';
import logger from '../utils/logger.js';
import { packetParser } from '../utils/packet/packetParser.js';
import { enqueueReceive } from '../utils/socket/messageQueue.js';

const { PACKET_TYPE_LENGTH, PACKET_TOKEN_LENGTH, PACKET_TOTAL_LENGTH, PACKET_PAYLOAD_LENGTH } =
  configs;

export const onData = (socket) => async (data) => {
  try {
    socket.buffer = Buffer.concat([socket.buffer, data]);

    while (socket.buffer.length >= PACKET_TOTAL_LENGTH) {
      const packetType = socket.buffer.readUintBE(0, PACKET_TYPE_LENGTH);
      const tokenLength = socket.buffer.readUintBE(PACKET_TYPE_LENGTH, PACKET_TOKEN_LENGTH);
      let offset = PACKET_TYPE_LENGTH + PACKET_TOKEN_LENGTH;
      const token = socket.buffer.subarray(offset, offset + tokenLength).toString();
      offset += tokenLength;
      const payloadLength = socket.buffer.readUintBE(offset, PACKET_PAYLOAD_LENGTH);
      offset += PACKET_PAYLOAD_LENGTH;
      const requiredLength = offset + payloadLength;

      if (socket.buffer.length >= requiredLength) {
        const payloadData = socket.buffer.subarray(offset, requiredLength);
        socket.buffer = socket.buffer.subarray(requiredLength);
        const payload = packetParser(packetType, payloadData);
        payload.token = token;
        enqueueReceive(socket.id, packetType, payload);
      } else {
        break;
      }
    }
  } catch (error) {
    socket.buffer = Buffer.alloc(0);
    logger.error(error);
  }
};
