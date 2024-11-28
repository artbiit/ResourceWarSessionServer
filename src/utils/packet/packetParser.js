import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import CustomError from '../error/customError.js';
import configs from '../../configs/configs.js';
import logger from '../logger.js';

export const packetParser = (packetType, payloadBuffer) => {
  const protoMessages = getProtoMessages();
  const protoType = getProtoTypeNameByHandlerId(packetType);
  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const packet = protoMessages[protoType];

  let payload = packet.toObject(packet.decode(payloadBuffer), {
    defaults: true, // 기본값 포함
    enums: Number, // 열거형 값을 문자열로 변환
    longs: Number, // Long 값을 문자열로 변환
    arrays: true, // 빈 배열 기본값 포함
    objects: true, // 빈 객체 기본값 포함
  });

  const typeName = getProtoTypeNameByHandlerId(packetType);
  const PayloadType = protoMessages[typeName];
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  payload = { ...payload };

  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    logger.info(
      `packetParser[${packetType}]. missingFields[${missingFields.length}] => ${missingFields.join(',')}`,
    );
    payload.missingFieldsLength = missingFields.length;
  }

  return payload;
};
