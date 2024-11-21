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

const configs = {
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
