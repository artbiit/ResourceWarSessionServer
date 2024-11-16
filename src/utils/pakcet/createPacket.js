import { getProtoMessages } from '../../init/loadProtos.js';
import configs from '../../configs/configs.js';
import { getFieldNameByHandlerId } from '../../handlers/index.js';

const { PACKET_TYPE_LENGTH, PACKET_TOKEN_LENGTH, PACKET_PAYLOAD_LENGTH, CLIENT_VERSIONS } = configs;

export const createPacket = (responseType, data = {}) => {
  const packetTypeBuffer = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetTypeBuffer.writeUintBE(responseType, 0, PACKET_TYPE_LENGTH);

  const version = CLIENT_VERSIONS[0];

  const versionBuffer = Buffer.from(version);

  const versionLengthBuffer = Buffer.alloc(PACKET_TOKEN_LENGTH);
  versionLengthBuffer.writeUintBE(versionBuffer.length, 0, PACKET_TOKEN_LENGTH);

  const protoMessages = getProtoMessages();
  const gamePacket = protoMessages.GamePacket;
  const payload = { [getFieldNameByHandlerId(responseType)]: data };
  const gamePacketMessage = gamePacket.create(payload);
  const gamePacketBuffer = gamePacket.encode(gamePacketMessage).finish();
  const payloadLengthBuffer = Buffer.alloc(PACKET_PAYLOAD_LENGTH);
  payloadLengthBuffer.writeUintBE(gamePacketBuffer.length, 0, PACKET_PAYLOAD_LENGTH);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([
    packetTypeBuffer,
    versionLengthBuffer,
    versionBuffer,
    payloadLengthBuffer,
    gamePacketBuffer,
  ]);
};
