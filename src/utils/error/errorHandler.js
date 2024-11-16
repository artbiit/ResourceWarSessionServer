import logger from '../logger.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';

/**
 *  CustomError 객체를 전달하지 않을시 클라이언트로 데이터를 반환하지 않습니다.
 */
export const handleError = (packetType, error) => {
  if (error.code) {
    logger.error(
      `[${getProtoTypeNameByHandlerId(packetType)}/${packetType}]에러 코드: ${error.code}, 메시지: ${error.message}`,
    );
    // return new Result({ message }, responseType);
  } else {
    logger.error(`[${getProtoTypeNameByHandlerId(packetType)}/${packetType}]일반 에러: ${error}`);
  }
};
