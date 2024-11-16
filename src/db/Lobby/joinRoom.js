import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';

export const joinRoom = async (gameCode) => {
    const redis = await getRedis();

    return { joinRoomResultCode : gameCode, gameUrl : "이것도 URL 비워놓으래 이정수가" };
}