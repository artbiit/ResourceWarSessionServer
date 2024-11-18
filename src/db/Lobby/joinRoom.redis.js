import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';
import { JoinRoomCode } from './lobbyConstants.js';
import { userSessions } from '../../sessions/sessions.js';

export const joinRoom = async (socket) => {
  const redis = await getRedis();
  const lobbyInfo = await redis.hgetall(`GameSession:${gameCode}`);
  if (!lobbyInfo) {
    // 코드가 틀림
    return { joinRoomResultCode: JoinRoomCode.NOT_EXIST, gameUrl: '' };
  } else if (lobbyInfo.player_count === '4') {
    // 풀방
    return { joinRoomResultCode: JoinRoomCode.IS_ALREADY_FULL, gameUrl: '' };
  }
  else if(!lobbyInfo.isPrivate){
    // private방 일 때
    return { joinRoomResultCode: JoinRoomCode.PRIVATE_ROOM, gameUrl: '' };
  }
  lobbyInfo.player_count = (Number(lobbyInfo.player_count) + 1).toString();

  redis.hset(`GameSession:${gameCode}`, lobbyInfo);
  const lobbyMember = {
    userId: userSessions[socket].id,
    is_ready: false,
    connected: true,
    load_progress: 0,
    team_id: 0,
    avatar_id: 0,
  };

  redis.hset(`LobbyMember:${gameCode}`, lobbyMember);
  //redis.expire(`LobbyMember:${gameCode}`, 30);
  return { joinRoomResultCode: JoinRoomCode.EXIST, gameUrl: lobbyInfo.game_id };
};
