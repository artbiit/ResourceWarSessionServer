import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import configs from '../configs/configs.js';
import { GlobalFailCode } from '../constants/handlerIds.js';
import { cacheUserToken, findUserByIdPw, getUserToken } from '../db/user/user.db.js';
import Result from './result.js';
import { addUser, getUserById } from '../session/user.session.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// 환경 변수에서 설정 불러오기
const { PacketType, SECURE_PEPPER, SECURE_SALT } = configs;


const SignInResultCode = {
  SUCCESS: 0,
  IDPW_INVALID: 1,
  ALREADY_LOGGED_IN: 2,
};

/***
 * - 로그인 요청(request) 함수
 *
 * 클라이언트에서 받은 로그인 정보를 통해 사용자를 인증(대소문자 구분)하고, 성공 시 JWT 토큰을 발급해주는 함수.
 *
 * @param {string} param.payload.id - 유저의 ID
 * @param {string} param.payload.password - 유저의 비밀번호
 * @returns {void} 별도의 반환 값은 없으며, 성공 여부와 메시지를 클라이언트에게 전송.
 */
export const loginRequestHandler = async ({ socket, payload }) => {
  const { id, password } = payload;

  // response data init
  let signInResultCode = SignInResultCode.SUCCESS;
  let message = undefined;
  let token = '';
  try {
    // 아이디와 비밀번호 기반으로 유저 찾기
    const hashedPassword = await bcrypt.hash(password + SECURE_PEPPER, SECURE_SALT);
    const userByDB = await findUserByIdPw(id, hashedPassword);
    if (userByDB) {
      const alreadyUser = getUserById(userByDB.seqNo);

      if (alreadyUser) {
        message = '이미 로그인되어 있는 계정입니다.';
        signInResultCode = SignInResultCode.ALREADY_LOGGED_IN;
        throw new Error(message);
      }

      // 토큰 생성
      token = uuidv4();

      // 토큰 캐싱
      await addUser(socket, userByDB, token);

      // 성공 메시지
      message = '로그인에 성공 했습니다.';
      logger.info(`로그인 성공 : ${userByDB.seqNo}`);
    } else {
      // 비밀번호가 틀렸을 경우
      signInResultCode = SignInResultCode.IDPW_INVALID;
      message = '아이디 혹은 비밀번호를 확인해주세요.';
    }
  } catch (error) {
    message = message || '로그인 과정 중 문제가 발생했습니다.';
    logger.error(`loginRequestHandler Error: ${error.message}`);
  }
  let expirationTime = Date.now() + 3600000;
/*
// 로그인 결과 (토큰 발급)
message S2CSignInRes {
uint8 signInResultCode = 1; // 0이면 성공
string token = 2;
uint64 expirationTime = 3;  // 만료시간
}
*/
  return new Result({ signInResultCode, token, expirationTime }, PacketType.LOGIN_RESPONSE);
};