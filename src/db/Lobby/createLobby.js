import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';
import { LobbyState } from './lobbyConstants.js';

export const createLobby = async (isPrivate) => {
  // redis 불러오기
  const redis = await getRedis();

  // 저장할 변수 선언
  const player_count = 0;
  const max_player = 4;
  const now = Date.now();
  const GAME_ID = uuidv4();

  const GameSession = {
    game_id: GAME_ID,
    create_at: now,
    update_at: now,
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
