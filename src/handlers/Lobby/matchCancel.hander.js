import Result from '../result.js';
import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
import { getGameSession } from '../../db/Lobby/lobby.redis.js';
import {
  dequeueMatchMaking,
  enqueueMatchMaking,
  getLobbyCount,
} from '../../db/Lobby/match.redis.js';
const { PacketType, LobbyMatchResultCode, GameSessionState } = configs;

export const matchCancelHandler = async ({ payload }) => {
  const { token } = payload;
  await dequeueMatchMaking(token);
  new Result({}, PacketType.MATCH_CANCEL_RESPONSE);
};
