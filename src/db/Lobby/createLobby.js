import logger from '../utils/logger.js';
import { cacheUserToken, findUserByIdPw, getUserToken } from '../db/user/user.db.js';
import Result from './result.js';
import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';


const GAME_ID = uuidv4();

const LobbyState = {
  FINISH_READY: 0,
  NOT_READY: 1,
};

export const createLobby = async (isPrivate) => {
  const { isPrivate } = payload;
  const redis = await getRedis();

  const player_count = 0;
  const max_player = 4;

  const GameSession = {
    game_id: GAME_ID,
    create_at: Date.now(),
    update_at: Date.now(),
    isPrivate: isPrivate,
    state: LobbyState,
    max_player: max_player,
    player_count: player_count,
  };

  try {
    const transaction = redis.multi();

    transaction.hset(`GameSession:${GAME_ID}`, GameSession);
    transaction.rpush('GameSessions', GAME_ID);
    if (!isPrivate) {
      transaction.rpush('LobbyQueue', GAME_ID);
    }

    await transaction.exec();
  } catch (error) {
    logger.error(`Failed to Create Lobby : ${error.message}`);
  }

  return [GAME_ID, "여기에 게임 URL 넣기"];
};
