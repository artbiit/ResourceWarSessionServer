import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';
import { JoinRoomCode } from './lobbyConstants.js';
import { userSessions } from '../../sessions/sessions.js';

export const randomLobby = async (socket) => {
  const redis = await getRedis();
  const lobbyInfo = await redis.keys(`GameSession*`);
  console.log(lobbyInfo);

  return { joinRoomResultCode: JoinRoomCode.EXIST, gameUrl: lobbyInfo.game_id };
};
