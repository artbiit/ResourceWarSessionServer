import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';

const GAME_ID = uuidv4();

const LobbyState = {
  FINISH_READY: 0,
  NOT_READY: 1,
};

export const createLobby = async (isPrivate) => {
  const redis = await getRedis();

  const player_count = 0;
  const max_player = 4;

  const GameSession = {
    game_id: GAME_ID,
    create_at: Date.now(),
    update_at: Date.now(),
    isPrivate: isPrivate,
    state: LobbyState.NOT_READY,
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
  const gameCode = GAME_ID;
  const gameUrl = '여기에 게임 URL 넣기';

  return { gameCode : gameCode, gameUrl : gameUrl };
};
