const GameSessionState = Object.freeze({
  CREATING: 0, //생성 요청 중
  DESTROY: 1, //게임 종료 후 제거중
  LOBBY: 2, //로비에서 대기 중
  LOADING: 3, //로딩 중
  PLAYING: 4, //게임 진행 중
});

export default {
  GameSessionState,
};
