import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import configs from '../configs/configs.js';
import { GlobalFailCode } from '../constants/handlerIds.js';
import { cacheUserToken, findUserByIdPw, getUserToken } from '../db/user/user.db.js';
import Result from './result.js';
import { addUser, getUserById } from '../session/user.session.js';
import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';

// 환경 변수에서 설정 불러오기
const { PacketType } = configs;

const GAME_ID = uuidv4();

const LobbyState = {
  FINISH_READY: 0,
  NOT_READY: 1,
};

/***
 * - 방 생성 요청(request) 함수
 *
 * @param {bool} param.payload.isPrivate - 비공개 방 여부
 * @returns {void} 별도의 반환 값은 없으며, 성공 여부와 메시지를 클라이언트에게 전송.
 */

/*
// 방 생성 결과
message S2CCreateRoomRes {
string gameCode = 1; // 방 코드
string gameUrl = 2;
}
*/
export const createLobbyHandler = async ({ socket, payload }) => {
  const { isPrivate } = payload;
  const redis = await getRedis();

  const player_count = 0;
  const max_player = 4;

  const GameSession = {
    game_id: GAME_ID,
    create_at: Date.now(),
    update_at: Date.now(),
    isPrivate: isPrivate,
    state: LobbyState,
    max_player: max_player,
    player_count: player_count,
  };

  try {
    const transaction = redis.multi();

    transaction.hset(`GameSession:${GAME_ID}`, GameSession);
    transaction.rpush('GameSessions', GAME_ID);
    if (!isPrivate) {
      transaction.rpush('LobbyQueue', GAME_ID);
    }

    await transaction.exec();
  } catch (error){
    logger.error(`Failed to Create Lobby : ${error.message}`);
  }
/*
// 방 생성 결과
message S2CCreateRoomRes {
string gameCode = 1; // 방 코드
string gameUrl = 2;
}
*/
  return new Result({ gameCode : GAME_ID, gameUrl : "이거 주소임" }, PacketType.CREATE_ROOM_RESPONSE);
};
