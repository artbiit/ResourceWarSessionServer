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
    gameUrl: '아직 완성된 기능이 아닙니다.',
  };
  /**
   * 1. 대기중인 로비가 있는지 탐색
   * 2. 없으면 거절
   * 3. 있을 경우 점유 후 사용자에게 연결 전달
   * 4. 게임 서버에 메세지 pub해서 게임 서버가 대기할 수 있도록 알림
   * 5. 연결 정보 및 게임 코드 반환
   *
   */
  try {
    const now = Date.now();
    const gameInfo = {
      isPrivate,
      state: GameSessionState.CREATING,
      gameUrl: '',
      maxPlayer: 4,
      currentPlayer: 0, //세션에 연결된 수
      previousPlayer: 1, //연결 시도 중인 유저 수
      createdAt: now,
      updatedAt: now,
    };
    for (let tryCount = 0; tryCount < 3; tryCount++) {
      const currentGameCode = nanoid();
      if (await trySetGameSession(currentGameCode, gameInfo)) {
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
