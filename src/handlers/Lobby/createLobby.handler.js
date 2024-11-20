import Result from '../result.js';
import { trySetGameSession, registNewLobby } from '../../db/Lobby/lobby.redis.js';
import { customAlphabet } from 'nanoid';
import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
const { PacketType } = configs;
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

export const createLobbyHandler = async ({ payload }) => {
  const { isPrivate } = payload;
  let resultPayload = {
    gameCode: '',
    gameUrl: '아직 완성된 기능이 아닙니다.',
  };
  try {
    for (let tryCount = 0; tryCount < 3; tryCount++) {
      const currentGameCode = nanoid();
      if (await trySetGameSession(currentGameCode, isPrivate)) {
        await registNewLobby(currentGameCode);
        resultPayload.gameCode = currentGameCode;
        break;
      }
    }
  } catch (error) {
    resultPayload.gameCode = '';
    resultPayload.gameUrl = '';
    logger.error(`createLobbyHandler. ${error.message}`);
  }

  return new Result(resultPayload, PacketType.CREATE_ROOM_RESPONSE);
};
