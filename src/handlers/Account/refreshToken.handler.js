import configs from '../../configs/configs.js';
import { findUserByUserName } from '../../db/Account/account.db.js';
import { cacheUserSession, getUserSession } from '../../db/Account/account.redis.js';
import { getUser, addUserSession } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';
import Result from '../result.js';
import { createNewToken } from './helper.js';
const { RefreshTokenResultCode, PacketType } = configs;

export const refreshTokenHandler = async ({ socket, payload }) => {
  const { token } = payload;
  let resultPayload = {
    refreshTokenResultCode: RefreshTokenResultCode.SUCCESS,
    expirationTime: 0,
    token: '',
  };
  try {
    const userBySession = getUser(token);

    if (!userBySession) {
      resultPayload.refreshTokenResultCode = PacketType.INVALID_TOKEN;
      throw new Error(`${[PacketType.INVALID_TOKEN]}`);
    }

    const userName = userBySession.userInfo.userName;

    const [userByDB, userByRedis] = await Promise.all([
      findUserByUserName(userName),
      getUserSession(token),
    ]);

    if (!userByDB) {
      resultPayload.refreshTokenResultCode = PacketType.UNKNOWN_USERNAME;
      throw new Error(`${[PacketType.UNKNOWN_USERNAME]} : ${userName}`);
    }

    if (!userByRedis) {
      resultPayload.refreshTokenResultCode = PacketType.INVALID_TOKEN;
      throw new Error(`${[PacketType.INVALID_TOKEN]}`);
    }

    const now = Date.now();

    if (userByRedis.expirationTime < now) {
      resultPayload.refreshTokenResultCode = PacketType.EXPIRED_TOKEN;
      throw new Error(`${[PacketType.EXPIRED_TOKEN]}`);
    }

    if (userByRedis.id != userByDB.id) {
      resultPayload.refreshTokenResultCode = PacketType.MISMATCH_TOKEN_USERNAME;
      throw new Error(`${[PacketType.MISMATCH_TOKEN_USERNAME]}`);
    }

    const { token: newToken, expirationTime: newExpirationTime } = createNewToken();

    resultPayload.token = newToken;
    resultPayload.expirationTime = newExpirationTime;
    await cacheUserSession(userByDB.id, newToken, newExpirationTime);
    addUserSession(socket, userByDB.id, userName, newToken, newExpirationTime);
  } catch (error) {
    resultPayload.expirationTime = 0;
    resultPayload.token = '';
    if (
      !resultPayload.refreshTokenResultCode ||
      resultPayload.refreshTokenResultCode == RefreshTokenResultCode.SUCCESS
    ) {
      resultPayload.refreshTokenResultCode = RefreshTokenResultCode.UNKNOWN_ERROR;
    }
    logger.error(error);
  }

  return new Result(resultPayload, PacketType.REFRESH_TOKEN_RESPONSE);
};
