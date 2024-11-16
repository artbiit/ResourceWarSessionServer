import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import CustomError from '../error/customError.js';
import configs from '../../configs/configs.js';
const { GlobalFailCode } = configs;

export const packetParser = (packetType, payloadBuffer) => {
  const protoMessages = getProtoMessages();
  const protoType = getProtoTypeNameByHandlerId(packetType);
  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const packet = protoMessages[protoType];

  const payload = packet.decode(payloadBuffer);

  const typeName = getProtoTypeNameByHandlerId(packetType);
  const PayloadType = protoMessages[typeName];
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);

  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    throw new CustomError(
      GlobalFailCode.INVALID_REQUEST,
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
    );
  }

  return payload;
};