const JoinLobbyResultCode = {
  SUCCESS: 0, // 방 입장 성공
  NOT_EXIST: 1, // 클라에서 보내준 해당 gameCode에 맞는 대기실이 없습니다.
  IS_FULL: 2, // 이미 인원이 가득찼습니다.
  UNKNOWN_ERROR: 20000,
};

export default {
  JoinLobbyResultCode,
};
