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

  // 게임 코드 랜덤 설정
  async function generateUniqueGameCode() {
    let gameCode;
    do {
      gameCode = Math.floor(100000 + Math.random() * 900000);
    } while (await redis.exists(`GameSession:${gameCode}`));
    return gameCode;
  }

  //게임 세션에 집어넣을 데이터
  const GameSession = {
    game_id: GAME_ID,
    create_at: now,
    update_at: now,
    isPrivate: isPrivate,
    state: LobbyState.NOT_READY,
    max_player: max_player,
    player_count: player_count,
  };

  //랜덤하게 설정된 게임코드
  const gameCode = await generateUniqueGameCode();
  console.log('이거 게임코드야 : ', gameCode);

  try {
    const transaction = redis.multi();

    transaction.hset(`GameSession:${gameCode}`, GameSession);
    transaction.rpush('GameSessions', GAME_ID);
    if (!isPrivate) {
      transaction.rpush('LobbyQueue', GAME_ID);
    }
    await transaction.exec();
  } catch (error) {
    logger.error(`Failed to Create Lobby : ${error.message}`);
  }

  return { gameCode: gameCode, gameUrl: GAME_ID };
};
