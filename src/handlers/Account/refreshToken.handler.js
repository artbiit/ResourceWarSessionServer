import configs from '../../configs/configs.js';
import { findUserByUserName } from '../../db/Account/account.db.js';
import { cacheUserSession, getUserSession } from '../../db/Account/account.redis.js';
import { addUserSession, getUserBySocket } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';
import Result from '../result.js';
import { createNewToken } from './helper.js';
const { RefreshTokenResultCode, PacketType } = configs;

export const refreshTokenHandler = async ({ socket, payload }) => {
  const { token, id: userName } = payload;

  let resultPayload = {
    resultCode: RefreshTokenResultCode.SUCCESS,
    expirationTime: 0,
    token: '',
  };
  try {
    const { userByDB, userBySession } = await Promise.all([
      findUserByUserName(userName),
      getUserSession(token),
    ]);
    if (!userByDB) {
      resultPayload.resultCode = PacketType.UNKNOWN_USERNAME;
      throw new Error(`${[PacketType.UNKNOWN_USERNAME]} : ${userName}`);
    }

    if (!userBySession) {
      resultPayload.resultCode = PacketType.INVALID_TOKEN;
      throw new Error(`${[PacketType.INVALID_TOKEN]}`);
    }

    const now = Date.now();

    if (userBySession.expirationTime < now) {
      resultPayload.resultCode = PacketType.EXPIRED_TOKEN;
      throw new Error(`${[PacketType.EXPIRED_TOKEN]}`);
    }

    if (userBySession.token != token) {
      resultPayload.resultCode = PacketType.MISMATCH_TOKEN_USERNAME;
      throw new Error(`${[PacketType.MISMATCH_TOKEN_USERNAME]}`);
    }

    const { token, expirationTime } = createNewToken();

    await cacheUserSession(userByDB.id, token, expirationTime);
    addUserSession(socket, userByDB.id, userName, token, expirationTime);
  } catch (error) {
    resultPayload.expirationTime = 0;
    resultPayload.token = '';
    if (resultPayload.resultCode == RefreshTokenResultCode.SUCCESS) {
      resultPayload.resultCode = RefreshTokenResultCode.UNKNOWN_ERROR;
    }
    logger.error(`refreshTokenHandler. ${error.message}`);
  }

  return new Result(resultPayload, PacketType.REFRESH_TOKEN_RESPONSE);
};
