import CONSTANTS from './constants/constants.js';
import env from './constants/env.js';
import REDIS_CONFIGS from './constants/redis.js';
import {
  PACKET_TYPE_LENGTH,
  PACKET_PAYLOAD_LENGTH,
  PACKET_TOKEN_LENGTH,
  PacketType,
} from './constants/header.js';
import accountConstants from './constants/accountConstant.js';
import lobbyConstant from './constants/lobbyConstant.js';
import gameSession from './constants/gameSession.js';
import matchConstants from './constants/matchConstants.js';

const configs = {
  ...matchConstants,
  ...gameSession,
  ...lobbyConstant,
  ...accountConstants,
  ...CONSTANTS,
  ...REDIS_CONFIGS,
  PACKET_TYPE_LENGTH,
  PACKET_PAYLOAD_LENGTH,
  PACKET_TOKEN_LENGTH,
  PACKET_TOTAL_LENGTH: PACKET_TYPE_LENGTH + PACKET_PAYLOAD_LENGTH + PACKET_TOKEN_LENGTH,
  PacketType,
  ...env,
};

export default configs;
