import Result from '../result.js';
import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
import { getGameSession } from '../../db/Lobby/lobby.redis.js';
const { PacketType, LobbyMatchResultCode, GameSessionState } = configs;

export const matchLobbyHandler = async ({ payload }) => {
  let roomMatchResultCode = LobbyMatchResultCode.SUCCESS;

  new Result({ roomMatchResultCode }, PacketType.MATCH_START_RESPONSE);
};
