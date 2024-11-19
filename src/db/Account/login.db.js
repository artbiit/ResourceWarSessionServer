import { SignInResultCode } from './accountConstant.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { postgres } from '../../db/postgresql.js';
import configs from '../../configs/configs.js';
import { getRedis } from '../redis.js';
import { addUserSession } from '../../sessions/user.session.js';

const { SECURE_PEPPER, SECURE_SALT } = configs;

export const login = async (id, password, socket) => {
  let signInResultCode = SignInResultCode.IDPW_INVALID;
  let token = '';
  let expirationTime = undefined;
  // 아이디와 비밀번호 기반으로 유저 찾기
  const salt = await bcrypt.genSalt(Number(SECURE_SALT));
  const hashedPassword = await bcrypt.hash(password + SECURE_PEPPER, salt);
  const checkUser = await postgres.execute(
    `SELECT * FROM Account WHERE nickname = ($1) AND password = ($2) ;`,
    [id, hashedPassword],
  );
  if (checkUser) {
    token = uuidv4();
    expirationTime = Date.now() + 3600000;
    signInResultCode = SignInResultCode.SUCCESS;

    const userInfo = {
      id,
      token,
      expired_time : expirationTime,
    }
    
    // redis에 로그인한 유저 정보 저장
    const redis = await getRedis();
    redis.hset(`UserSession:${id}`, userInfo);
    addUserSession(socket, userInfo);
  }
  return { signInResultCode, token, expirationTime };
};
