import configs from '../configs/configs.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { loginRequestHandler } from './Account/login.handler.js';
import { refreshTokenHandler } from './Account/refreshToken.handler.js';
import { registerRequestHandler } from './Account/register.handler.js';
import { signOutHandler } from './Account/signout.handler.js';
import { createLobbyHandler } from './Lobby/createLobby.handler.js';
const { PacketType } = configs;

const handlers = {
  [PacketType.SIGN_UP_REQUEST]: {
    handler: registerRequestHandler,
    protoType: 'account.C2SSignUpReq',
  },
  [PacketType.SIGN_UP_RESPONSE]: {
    handler: undefined,
    protoType: 'account.S2CSignUpRes',
  },
  [PacketType.SIGN_IN_REQUEST]: {
    handler: loginRequestHandler,
    protoType: 'account.C2SSignInReq',
  },
  [PacketType.SIGN_IN_RESPONSE]: {
    handler: undefined,
    protoType: 'account.S2CSignInRes',
  },
  [PacketType.SIGN_OUT_REQUEST]: {
    handler: signOutHandler,
    protoType: 'account.C2SSignOutReq',
  },
  [PacketType.SIGN_OUT_RESPONSE]: {
    handler: undefined,
    protoType: 'account.S2CSignOutRes',
  },
  [PacketType.REFRESH_TOKEN_REQUEST]: {
    handler: refreshTokenHandler,
    protoType: 'account.C2SRefreshTokenReq',
  },
  [PacketType.REFRESH_TOKEN_RESPONSE]: {
    handler: undefined,
    protoType: 'account.S2CRefreshTokenRes',
  },
  [PacketType.CREATE_ROOM_REQUEST]: {
    handler: createLobbyHandler,
    protoType: 'lobby.C2SCreateRoomReq',
  },
  [PacketType.CREATE_ROOM_RESPONSE]: {
    handler: undefined,
    protoType: 'lobby.S2CCreateRoomRes',
  },
  [PacketType.JOIN_ROOM_REQUEST]: {
    handler: undefined,
    protoType: 'lobby.C2SJoinRoomReq',
  },
  [PacketType.JOIN_ROOM_RESPONSE]: {
    handler: undefined,
    protoType: 'lobby.S2CJoinRoomRes',
  },
  [PacketType.MATCH_REQUEST]: {
    handler: undefined,
    protoType: 'lobby.C2SMatchReq',
  },
  [PacketType.MATCH_RESPONSE]: {
    handler: undefined,
    protoType: 'lobby.S2CMatchRes',
  },
  [PacketType.MISSING_FIELD]: {
    handler: undefined,
    protoType: 'common.S2CMissingFieldNoti',
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
