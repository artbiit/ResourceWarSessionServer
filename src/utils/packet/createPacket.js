import { getProtoMessages } from '../../init/loadProtos.js';
import configs from '../../configs/configs.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';

const { PACKET_TYPE_LENGTH, PACKET_TOKEN_LENGTH, PACKET_PAYLOAD_LENGTH, CLIENT_VERSIONS } = configs;

export const createPacket = (packetType, token = '', data = {}) => {
  const packetTypeBuffer = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetTypeBuffer.writeUintBE(packetType, 0, PACKET_TYPE_LENGTH);

  const tokenBuffer = Buffer.from(token);
  const tokenLengthBuffer = Buffer.alloc(PACKET_TOKEN_LENGTH);
  tokenLengthBuffer.writeUintBE(tokenBuffer.length, 0, PACKET_TOKEN_LENGTH);
  const protoMessages = getProtoMessages();
  const protoType = getProtoTypeNameByHandlerId(packetType);
  const message = protoMessages[protoType];
  const payload = data;
  const packetMessage = message.create(payload);
  const packetBuffer = message.encode(packetMessage).finish();
  const payloadLengthBuffer = Buffer.alloc(PACKET_PAYLOAD_LENGTH);
  payloadLengthBuffer.writeUintBE(packetBuffer.length, 0, PACKET_PAYLOAD_LENGTH);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([
    packetTypeBuffer,
    tokenLengthBuffer,
    tokenBuffer,
    payloadLengthBuffer,
    packetBuffer,
  ]);
};
