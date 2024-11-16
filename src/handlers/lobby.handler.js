import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import configs from '../configs/configs.js';
import { GlobalFailCode } from '../constants/handlerIds.js';
import { cacheUserToken, findUserByIdPw, getUserToken } from '../db/user/user.db.js';
import Result from './result.js';
import { addUser, getUserById } from '../session/user.session.js';
import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';
import { createLobby } from '../db/Lobby/createLobby.js';
import { joinRoom } from '../db/Lobby/joinRoom.js';

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
  const { gameCode, gameUrl } = createLobby(isPrivate);
  /*
  dev에서 내걸로 가져와서 문제없는지 구동해보기
  */
  /*
// 방 생성 결과
message S2CCreateRoomRes {
string gameCode = 1; // 방 코드
string gameUrl = 2;
}
*/
  return new Result({ gameCode, gameUrl }, PacketType.CREATE_ROOM_RESPONSE);
};
