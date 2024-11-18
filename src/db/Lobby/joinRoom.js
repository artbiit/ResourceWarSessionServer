import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';

export const joinRoom = async (gameCode) => {
    const redis = await getRedis();
    console.log("이거 게임코드 : ",gameCode);
    const isPrivate = await redis.hgetall(`GameSession:${gameCode}`);

    console.log("대기실 : ",isPrivate);

    return { joinRoomResultCode : 0, gameUrl : "이것도 URL 비워놓으래 이정수가" };
}