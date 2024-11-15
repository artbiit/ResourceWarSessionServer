export const packetNames = {
  data: {
    GameState: 'data.GameState',
    ItemData: 'data.ItemData',
    PlayerRoomInfo: 'data.PlayerRoomInfo',
    PlayerInitialData: 'data.PlayerInitialData',
    PlayerState: 'data.PlayerState',
    FieldUnit: 'data.FieldUnit',
    Position: 'data.Position',
  },
  account: {
    C2SSignUpReq: 'account.C2SSignUpReq',
    S2CSignUpRes: 'account.S2CSignUpRes',
    C2SSignInReq: 'account.C2SSignInReq',
    S2CSignInRes: 'account.S2CSignInRes',
    C2SRefreshTokenReq: 'account.C2SRefreshTokenReq',
    S2CRefreshTokenRes: 'account.S2CRefreshTokenRes',
  },
  lobby: {
    C2SCreateRoomReq: 'lobby.C2SCreateRoomReq',
    S2CCreateRoomRes: 'lobby.S2CCreateRoomRes',
    C2SMatchCancelReq: 'lobby.C2SMatchCancelReq',
    S2CMatchProgressNoti: 'lobby.S2CMatchProgressNoti',
    C2SJoinRoomReq: 'lobby.C2SJoinRoomReq',
    S2CJoinRoomRes: 'lobby.S2CJoinRoomRes',
    C2SQuitRoomReq: 'lobby.C2SQuitRoomReq',
    S2CQuitRoomNoti: 'lobby.S2CQuitRoomNoti',
    C2STeamChangeReq: 'lobby.C2STeamChangeReq',
    S2CTeamChangeNoti: 'lobby.S2CTeamChangeNoti',
    S2CSyncRoomNoti: 'lobby.S2CSyncRoomNoti',
    C2SGameStartReq: 'lobby.C2SGameStartReq',
    S2CGameStartRes: 'lobby.S2CGameStartRes',
    C2SLoadProgressNoti: 'lobby.C2SLoadProgressNoti',
    S2CSyncLoadNoti: 'lobby.S2CSyncLoadNoti',
  },
  inGame: {
    S2CInitialNoti: 'inGame.S2CInitialNoti',
    S2CSyncPlayersNoti: 'inGame.S2CSyncPlayersNoti',
    S2CSyncFurnaceStateNoti: 'inGame.S2CSyncFurnaceStateNoti',
    S2CSawmillStatusNoti: 'inGame.S2CSawmillStatusNoti',
    S2CWorkbenchStatusNoti: 'inGame.S2CWorkbenchStatusNoti',
    C2SPlayerActionReq: 'inGame.C2SPlayerActionReq',
    S2CPlayerActionRes: 'inGame.S2CPlayerActionRes',
    S2CSpawnObjectNoti: 'inGame.S2CSpawnObjectNoti',
    C2SDestoryObjectReq: 'inGame.C2SDestoryObjectReq',
    S2CDestoryObjectNoti: 'inGame.S2CDestoryObjectNoti',
    S2CSyncFieldUnitNoti: 'inGame.S2CSyncFieldUnitNoti',
    C2SSurrenderReq: 'inGame.C2SSurrenderReq',
    S2CSurrenderRes: 'inGame.S2CSurrenderRes',
    S2CSurrenderNoti: 'inGame.S2CSurrenderNoti',
    S2CGameOverNoti: 'inGame.S2CGameOverNoti',
    C2SMoveToAreaMapReq: 'inGame.C2SMoveToAreaMapReq',
    S2CMoveToAreaMap: 'inGame.S2CMoveToAreaMap',
    C2SWorkbenchReq: 'inGame.C2SWorkbenchReq',
    S2CWorkbenchRes: 'inGame.S2CWorkbenchRes',
    C2SFurnaceReq: 'inGame.C2SFurnaceReq',
    S2CFurnaceRes: 'inGame.S2CFurnaceRes',
    C2SSawmillReq: 'inGame.C2SSawmillReq',
    S2CSawmillRes: 'inGame.S2CSawmillRes',
  },
  healthCheck: {
    S2CPingReq: 'healthCheck.S2CPingReq',
    C2SPongRes: 'healthCheck.C2SPongRes',
  },
};
