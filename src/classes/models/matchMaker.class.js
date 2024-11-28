import configs from '../../configs/configs.js';
import logger from '../../utils/logger.js';
import { getSubscriberRedis } from '../../db/redis.js';
import { getLobby } from '../../db/Lobby/match.redis.js';
import { getUserSession } from '../../db/Account/account.redis.js';
import { isExpired } from '../../handlers/Account/helper.js';
import { getGameSession } from '../../db/Lobby/lobby.redis.js';
import matchProgressNotification from '../../utils/notification/matchProgressNotification.js';
const {
  REDIS_MATCH_START_REQUEST_CHANNEL,
  REDIS_MATCH_CANCEL_REQUEST_CHANNEL,
  MatchProgressCode,
  GameSessionState,
} = configs;

class MatchMaker {
  constructor() {
    this.activeMatches = new Map();
  }

  async init() {
    const redis = await getSubscriberRedis();
    await redis.subscribe(REDIS_MATCH_START_REQUEST_CHANNEL);
    await redis.subscribe(REDIS_MATCH_CANCEL_REQUEST_CHANNEL);

    redis.on('message', async (channel, message) => {
      //유저 토큰으로 넘어옴
      if (channel === REDIS_MATCH_START_REQUEST_CHANNEL) {
        await this.#startMatchMaking(message);
      }
      if (channel === REDIS_MATCH_CANCEL_REQUEST_CHANNEL) {
        this.#cancelMatchMaking(message);
      }
    });
    logger.info('MatchMaker initialized');
  }

  #startMatchMaking = async (userToken) => {
    if (!userToken) return;

    let matchProgressCode = MatchProgressCode.PROGRESSING;
    let gameUrl = '';
    const startTime = Date.now();

    // 이미 진행 중인 매칭이 있으면 무시
    if (this.activeMatches.has(userToken)) return;
    this.activeMatches.set(userToken, true);
    try {
      const user = getUserSession(userToken);

      // 세션 만료 시 작업 취소
      if (!user || isExpired(user.expirationTime)) {
        this.activeMatches.delete(userToken);
        matchProgressCode = MatchProgressCode.FAIL;
      }

      let index = 0;
      // 매칭 로직 수행
      while (this.activeMatches.get(userToken)) {
        // 매칭 중단 여부 확인
        const user = getUserSession(userToken);

        if (!user || isExpired(user.expirationTime)) {
          break;
        }

        const targetGameCode = await getLobby(index++);
        if (!targetGameCode) {
          matchProgressCode = MatchProgressCode.FAIL;
          logger.info(`MatchMaker. Lobby is empty`);
          break;
        }

        const gameInfo = await getGameSession(targetGameCode);

        if (!gameInfo) {
          matchProgressCode = MatchProgressCode.FAIL;
          logger.info(`MatchMaker. Fail get gameInfo`);
          break;
        }

        //꽉찼다 판단되면 다음것 시도하게
        if (gameInfo.maxPlayer <= gameInfo.currentPlayer + gameInfo.previousPlayer) {
          logger.info(`MatchMaker. ${targetGameCode} is full => ${JSON.stringify(gameInfo)}`);
        } else if (gameInfo.state != GameSessionState.LOBBY) {
          logger.info(`MatchMaker.Room is not lobby : ${gameInfo.state}`);
        } else {
          matchProgressCode = MatchProgressCode.SUCCESS;
          gameUrl = gameInfo.gameUrl;
        }

        matchProgressNotification({
          matchProgressCode,
          elapsedTime: Date.now() - startTime,
          gameUrl,
        });
        if (matchProgressCode == MatchProgressCode.SUCCESS) {
          break;
        }
        // 매칭 처리 로직
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 예시용 딜레이
      }
    } catch (error) {
      matchProgressCode = MatchProgressCode.FAIL;
      matchProgressNotification({
        matchProgressCode,
        elapsedTime: Date.now() - startTime,
        gameUrl: '',
      });
      logger.error(`MatchMaker error for userToken: ${userToken}`, error);
    } finally {
      this.activeMatches.delete(userToken);
    }
  };

  #cancelMatchMaking = (userToken) => {
    if (this.activeMatches.has(userToken)) {
      this.activeMatches.delete(userToken);
      logger.info(`MatchMaking cancelled for userToken: ${userToken}`);
    }
  };
}

const matchMaker = new MatchMaker();
export default matchMaker;
