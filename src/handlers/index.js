import configs from '../configs/configs.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { loginRequestHandler } from './Account/login.handler.js';
import { refreshTokenHandler } from './Account/refreshToken.handler.js';
import { registerRequestHandler } from './Account/register.handler.js';
import { signOutHandler } from './Account/signout.handler.js';
import { createLobbyHandler } from './Lobby/createLobby.handler.js';
import { joinLobbyHandler } from './Lobby/joinLobby.handler.js';
import { matchCancelHandler } from './Lobby/matchCancel.hander.js';
import { matchLobbyHandler } from './Lobby/matchLobby.handler.js';
const { PacketType } = configs;
const handlers = {
  [PacketType.GAME_STATE]: {
    handler: undefined,
    protoType: 'protocol.GameState',
  },
  [PacketType.ITEM_DATA]: {
    handler: undefined,
    protoType: 'protocol.ItemData',
  },
  [PacketType.PLAYER_ROOM_INFO]: {
    handler: undefined,
    protoType: 'protocol.PlayerRoomInfo',
  },
  [PacketType.PLAYER_INITIAL_DATA]: {
    handler: undefined,
    protoType: 'protocol.PlayerInitialData',
  },
  [PacketType.PLAYER_STATE]: {
    handler: undefined,
    protoType: 'protocol.PlayerState',
  },
  [PacketType.FIELD_UNIT]: {
    handler: undefined,
    protoType: 'protocol.FieldUnit',
  },
  [PacketType.POSITION]: {
    handler: undefined,
    protoType: 'protocol.Position',
  },
  [PacketType.SIGN_UP_REQUEST]: {
    handler: registerRequestHandler,
    protoType: 'protocol.C2SSignUpReq',
  },
  [PacketType.SIGN_UP_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CSignUpRes',
  },
  [PacketType.SIGN_IN_REQUEST]: {
    handler: loginRequestHandler,
    protoType: 'protocol.C2SSignInReq',
  },
  [PacketType.SIGN_IN_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CSignInRes',
  },
  [PacketType.SIGN_OUT_REQUEST]: {
    handler: signOutHandler,
    protoType: 'protocol.C2SSignOutReq',
  },
  [PacketType.SIGN_OUT_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CSignOutRes',
  },
  [PacketType.REFRESH_TOKEN_REQUEST]: {
    handler: refreshTokenHandler,
    protoType: 'protocol.C2SRefreshTokenReq',
  },
  [PacketType.REFRESH_TOKEN_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CRefreshTokenRes',
  },
  [PacketType.CREATE_ROOM_REQUEST]: {
    handler: createLobbyHandler,
    protoType: 'protocol.C2SCreateRoomReq',
  },
  [PacketType.CREATE_ROOM_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CCreateRoomRes',
  },
  [PacketType.MATCH_START_REQUEST]: {
    handler: matchLobbyHandler,
    protoType: 'protocol.C2SMatchStartReq',
  },
  [PacketType.MATCH_START_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CMatchStartRes',
  },
  [PacketType.MATCH_CANCEL_REQUEST]: {
    handler: matchCancelHandler,
    protoType: 'protocol.C2SMatchCancelReq',
  },
  [PacketType.MATCH_CANCEL_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CMatchCancelRes',
  },
  [PacketType.MATCH_PROGRESS_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CMatchProgressNoti',
  },
  [PacketType.JOIN_ROOM_REQUEST]: {
    handler: joinLobbyHandler,
    protoType: 'protocol.C2SJoinRoomReq',
  },
  [PacketType.JOIN_ROOM_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CJoinRoomRes',
  },
  [PacketType.QUIT_ROOM_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SQuitRoomReq',
  },
  [PacketType.QUIT_ROOM_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CQuitRoomNoti',
  },
  [PacketType.TEAM_CHANGE_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2STeamChangeReq',
  },
  [PacketType.TEAM_CHANGE_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CTeamChangeNoti',
  },
  [PacketType.SYNC_ROOM_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CSyncRoomNoti',
  },
  [PacketType.GAME_START_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SGameStartReq',
  },
  [PacketType.GAME_START_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CGameStartRes',
  },
  [PacketType.LOAD_PROGRESS_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CLoadProgressNoti',
  },
  [PacketType.SYNC_LOAD_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CSyncLoadNoti',
  },
  [PacketType.INITIAL_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CInitialNoti',
  },
  [PacketType.SYNC_PLAYERS_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CSyncPlayersNoti',
  },
  [PacketType.SYNC_FURNACE_STATE_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CSyncFurnaceStateNoti',
  },
  [PacketType.SAWMILL_STATUS_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CSawmillStatusNoti',
  },
  [PacketType.WORKBENCH_STATUS_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CWorkbenchStatusNoti',
  },
  [PacketType.PLAYER_ACTION_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SPlayerActionReq',
  },
  [PacketType.PLAYER_ACTION_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CPlayerActionRes',
  },
  [PacketType.PLAYER_MOVE]: {
    handler: undefined,
    protoType: 'protocol.C2SPlayerMove',
  },
  [PacketType.SPAWN_OBJECT_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CSpawnObjectNoti',
  },
  [PacketType.DESTROY_OBJECT_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SDestroyObjectReq',
  },
  [PacketType.DESTROY_OBJECT_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CDestroyObjectNoti',
  },
  [PacketType.SYNC_FIELD_UNIT_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CSyncFieldUnitNoti',
  },
  [PacketType.SURRENDER_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SSurrenderReq',
  },
  [PacketType.SURRENDER_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CSurrenderRes',
  },
  [PacketType.SURRENDER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CSurrenderNoti',
  },
  [PacketType.GAME_OVER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'protocol.S2CGameOverNoti',
  },
  [PacketType.MOVE_TO_AREA_MAP_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SMoveToAreaMapReq',
  },
  [PacketType.MOVE_TO_AREA_MAP_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CMoveToAreaMapRes',
  },
  [PacketType.WORKBENCH_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SWorkbenchReq',
  },
  [PacketType.WORKBENCH_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CWorkbenchRes',
  },
  [PacketType.FURNACE_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SFurnaceReq',
  },
  [PacketType.FURNACE_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CFurnaceRes',
  },
  [PacketType.SAWMILL_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SSawmillReq',
  },
  [PacketType.SAWMILL_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CSawmillRes',
  },
  [PacketType.PING_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.S2CPingReq',
  },
  [PacketType.PONG_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.C2SPongRes',
  },
  [PacketType.MISSING_FIELD]: {
    handler: undefined,
    protoType: 'protocol.S2CMissingFieldNoti',
  },
  [PacketType.NEED_AUTHORIZE]: {
    handler: undefined,
    protoType: 'protocol.S2CNeedAuthorizeNoti',
  },
  [PacketType.AUTHORIZE_REQUEST]: {
    handler: undefined,
    protoType: 'protocol.C2SAuthorizeReq',
  },
  [PacketType.AUTHORIZE_RESPONSE]: {
    handler: undefined,
    protoType: 'protocol.S2CAuthorizeRes',
  },
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].protoType;
};
