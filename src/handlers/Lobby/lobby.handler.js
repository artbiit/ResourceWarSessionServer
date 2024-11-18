import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
import Result from '../result.js';
import { v4 as uuidv4 } from 'uuid';
import { createLobby } from '../../db/Lobby/createLobby.js';
import { joinRoom } from '../../db/Lobby/joinRoom.js';

// 환경 변수에서 설정 불러오기
const { PacketType } = configs;

/***
 * - 방 생성 요청(request) 함수
 * @param {bool} param.payload.isPrivate - 비공개 방 여부
 * @returns {void} 별도의 반환 값은 없으며, 성공 여부와 메시지를 클라이언트에게 전송.
 */

export const createLobbyHandler = async ({ socket, payload }) => {
  const { isPrivate } = payload;
  const { gameCode, gameUrl } = await createLobby(isPrivate);
  //await joinLobbyHandler(socket, {gameCode : gameCode});

  return new Result({ gameCode, gameUrl }, PacketType.CREATE_ROOM_RESPONSE);
};

/***
 * - 방 입장 요청(request) 함수
 * @param {bool} param.payload.gameCode  - 입장하는 방의 게임코드
 * @returns {void} 별도의 반환 값은 없으며, 성공 여부와 메시지를 클라이언트에게 전송.
 */

export const joinLobbyHandler = async ({ socket, payload }) => {
  const { gameCode } = payload;
  const { joinRoomResultCode, gameUrl } = await joinRoom(gameCode);

  return new Result({ joinRoomResultCode, gameUrl }, PacketType.JOIN_ROOM_RESPONSE);
};
