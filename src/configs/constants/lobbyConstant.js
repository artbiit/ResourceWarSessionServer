const JoinLobbyResultCode = {
  SUCCESS: 0, // 방 입장 성공
  NOT_EXIST: 1, // 클라에서 보내준 해당 gameCode에 맞는 대기실이 없습니다.
  IS_FULL: 2, // 이미 인원이 가득찼습니다.
  UNKNOWN_ERROR: 20000,
};

const LobbyMatchResultCode = {
  SUCCESS: 0, // 방 입장 성공
  FAIL: 1, //입장 가능한 방이 없음
  UNKNOWN_ERROR: 20000,
};

import { v4 as uuidv4 } from 'uuid';
const REDIS_MATCH_START_REQUEST_CHANNEL = `MATCH_START_${uuidv4()}`;
const REDIS_MATCH_CANCEL_REQUEST_CHANNEL = `MATCH_CANCEL_${uuidv4()}`;
export default {
  JoinLobbyResultCode,
  LobbyMatchResultCode,
  REDIS_MATCH_START_REQUEST_CHANNEL,
  REDIS_MATCH_CANCEL_REQUEST_CHANNEL,
};
