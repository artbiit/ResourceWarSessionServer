import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import configs from '../configs/configs.js';
import { GlobalFailCode } from '../constants/handlerIds.js';
import { cacheUserToken, findUserByIdPw, getUserToken } from '../db/user/user.db.js';
import Result from './result.js';
import { addUser, getUserById } from '../session/user.session.js';
import { getRedis } from '../redis.js';
import { v4 as uuidv4 } from 'uuid';

export const joinRoom = () => {

}