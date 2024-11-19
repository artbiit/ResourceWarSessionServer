import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';
import { JoinRoomCode } from './lobbyConstants.js';
import { userSessions } from '../../sessions/sessions.js';
import { joinRoom } from './joinRoom.redis.js';

export const randomLobby = async (socket) => {
  const redis = await getRedis();
  let resultValue = undefined;

  const Sessions = await redis.keys(`GameSession:*`);
  for (const lobby of Sessions) {
    const lobbyInfo = await redis.hgetall(`${lobby}`);
    console.log(lobby);
    if (Number(lobbyInfo.player_count) < 4) {
      console.log(lobby.slice(-6));
      resultValue = await joinRoom(lobby.slice(-6), socket);
      break;
    }
  }
  console.log("이거 결과값임 : ",resultValue);
  return resultValue;
};
