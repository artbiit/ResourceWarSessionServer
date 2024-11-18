import logger from '../utils/logger.js';
import configs from '../configs/configs.js';
import Result from './result.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { postgres } from '../db/postgresql.js';

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
  let signInResultCode = SignInResultCode.IDPW_INVALID;
  let message = undefined;
  let token = '';
  try {
    // 아이디와 비밀번호 기반으로 유저 찾기
    const salt = await bcrypt.genSalt(Number(SECURE_SALT));
    const hashedPassword = await bcrypt.hash(password + SECURE_PEPPER, salt);
    const checkUser = await postgres.execute(
      `SELECT * FROM Account WHERE nickname = ($1) AND password = ($2) ;`,
      [id, hashedPassword],
    );
    if (checkUser) {
      token = uuidv4();
      signInResultCode = SignInResultCode.SUCCESS;
    } else {
      // 비밀번호가 틀렸을 경우
      message = '아이디 혹은 비밀번호를 확인해주세요.';
    }
  } catch (error) {
    message = message || '로그인 과정 중 문제가 발생했습니다.';
    logger.error(`loginRequestHandler Error: ${error.message}`);
  }
  let expirationTime = Date.now() + 3600000;

  return new Result({ signInResultCode, token, expirationTime }, PacketType.SIGN_IN_RESPONSE);
};
