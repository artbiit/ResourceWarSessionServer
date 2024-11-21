import Result from '../result.js';
import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
import { getGameSession } from '../../db/Lobby/lobby.redis.js';
const { PacketType, JoinLobbyResultCode, GameSessionState } = configs;

export const joinLobbyHandler = async ({ payload }) => {
  const { token, gameCode } = payload;
  let joinLobbyResultCode = JoinLobbyResultCode.SUCCESS;
  let gameUrl = '';

  try {
    const gameSession = getGameSession(gameCode);
    if (gameSession) {
      if (gameSession.state <= GameSessionState.DESTROY) {
        joinLobbyResultCode = JoinLobbyResultCode.NOT_EXIST;
      } else if (gameSession.maxPlayer <= gameSession.currentPlayer) {
        joinLobbyResultCode = JoinLobbyResultCode.IS_FULL;
      } else {
        gameUrl = gameSession.gameUrl;
      }
    } else {
      joinLobbyResultCode = JoinLobbyResultCode.NOT_EXIST;
    }
  } catch (error) {
    joinLobbyResultCode = JoinLobbyResultCode.UNKNOWN_ERROR;
    logger.error(error);
  }

  return new Result({ joinLobbyResultCode, gameUrl }, PacketType.JOIN_ROOM_RESPONSE);
};
