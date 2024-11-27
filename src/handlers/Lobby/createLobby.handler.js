import Result from '../result.js';
import { trySetGameSession, registNewLobby } from '../../db/Lobby/lobby.redis.js';
import { customAlphabet } from 'nanoid';
import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
const { PacketType, GameSessionState } = configs;
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

export const createLobbyHandler = async ({ payload }) => {
  const { isPrivate } = payload;

  let resultPayload = {
    gameCode: '',
    gameUrl: 'yonghyeon.store:5556',
  };
  try {
    const now = Date.now();
    const gameInfo = {
      isPrivate,
      state: GameSessionState.CREATING,
      gameUrl: '',
      maxPlayer: 4,
      currentPlayer: 0, //세션에 연결된 수
      previousPlayer: 1, //연결 시도 중인 유저 수
      createAt: now,
      updateAt: now,
    };
    for (let tryCount = 0; tryCount < 3; tryCount++) {
      const currentGameCode = nanoid();
      if (await trySetGameSession(currentGameCode, gameInfo)) {
        await registNewLobby(currentGameCode);
        // resultPayload.gameCode = currentGameCode;
        resultPayload.gameCode = 'testGameCode1';
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
