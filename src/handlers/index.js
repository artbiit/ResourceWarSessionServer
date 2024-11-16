import configs from '../configs/configs.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { createLobbyHandler, joinLobbyHandler } from './Lobby/lobby.handler.js';
import { registerRequestHandler } from './register.handler.js';

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
    handler: undefined,
    protoType: 'account.C2SSignInReq',
  },
  [PacketType.SIGN_IN_RESPONSE]: {
    handler: undefined,
    protoType: 'account.S2CSignInRes',
  },
  [PacketType.REFRESH_TOKEN_REQUEST]: {
    handler: undefined,
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
    handler: joinLobbyHandler,
    protoType: 'lobby.C2SJoinRoomReq',
  },
  [PacketType.JOIN_ROOM_RESPONSE]: {
    handler: undefined,
    protoType: 'lobby.S2CJoinRoomRes',
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
