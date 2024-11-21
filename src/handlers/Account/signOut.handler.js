import configs from '../../configs/configs.js';
import Result from '../result.js';
import { removeUserSession } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';
import { getUserSession, unlinkUserSession } from '../../db/Account/account.redis.js';
import { createPacket } from '../../utils/packet/createPacket.js';

const { SignOutResultCode, PacketType } = configs;

export const signOutHandler = async ({ socket, payload }) => {
  const { token } = payload;
  let signOutResultCode = SignOutResultCode.SUCCESS;

  try {
    const userByRedis = await getUserSession(token);
    if (userByRedis) {
      const packet = createPacket(PacketType.SIGN_OUT_RESPONSE, token, { signOutResultCode });
      await socket.end(packet);
      removeUserSession(token);
      await unlinkUserSession(token);
    } else {
      signOutResultCode = SignOutResultCode.INVALID_TOKEN;
    }
  } catch (error) {
    logger.error(`signOutHandler.`, error);
  }
};
