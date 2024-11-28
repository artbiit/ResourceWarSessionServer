import Result from '../result.js';
import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
import { getGameSession } from '../../db/Lobby/lobby.redis.js';
import { enqueueMatchMaking, getLobbyCount } from '../../db/Lobby/match.redis.js';
const { PacketType, LobbyMatchResultCode, GameSessionState } = configs;

export const matchLobbyHandler = async ({ payload }) => {
  const { token } = payload;
  let roomMatchResultCode = LobbyMatchResultCode.SUCCESS;
  try {
    if ((await getLobbyCount()) && token) {
      await enqueueMatchMaking(token);
    } else {
      roomMatchResultCode = LobbyMatchResultCode.FAIL;
    }
  } catch (error) {
    logger.error(error);
    roomMatchResultCode = LobbyMatchResultCode.FAIL;
  }
  new Result({ roomMatchResultCode }, PacketType.MATCH_START_RESPONSE);
};
