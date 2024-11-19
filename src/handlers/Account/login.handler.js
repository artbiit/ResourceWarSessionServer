import configs from '../../configs/configs.js';
import Result from '../result.js';
import { findUserByUserName } from '../../db/Account/account.db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { addUserSession } from '../../sessions/user.session.js';
// 환경 변수에서 설정 불러오기
const { PacketType, SignInResultCode, SECURE_PEPPER, SECURE_SALT } = configs;

/***
 * - 로그인 요청(request) 함수
 *
 * 클라이언트에서 받은 로그인 정보를 통해 사용자를 인증(대소문자 구분)하고, 성공 시 JWT 토큰을 발급해주는 함수.
 *
 * @param {string} param.payload.id - 유저의 ID
 * @param {string} param.payload.password - 유저의 비밀번호
 * @returns {void} 별도의 반환 값은 없으며, 성공 여부와 메시지를 클라이언트에게 전송.
 */

// 로그인 절차
//1. 파라미터가 잘 왔는가
//2. 합당한 유저 인가 (db에 있는 id인가)
//3. 패스워드가 일치하는가 (페퍼까지 포함해서)
//4. 토큰 발급
//5. 결과 반송
export const loginRequestHandler = async ({ socket, payload }) => {
  const { id: userName, password } = payload;
  let signInResultCode = SignInResultCode.SUCCESS;
  let token = '';
  let expirationTime = 0;

  const userByDB = await findUserByUserName(userName);
  if (userByDB) {
    if (bcrypt.compare(password + SECURE_PEPPER, SECURE_SALT)) {
      expirationTime = Date.now() + 3600000;
      token = uuidv4();
      addUserSession(socket, userByDB.id, userName, token, expirationTime);
    } else {
      signInResultCode = SignInResultCode.INVALID_PW;
    }
  } else {
    signInResultCode = SignInResultCode.INVALID_ID;
  }

  return new Result({ signInResultCode, token, expirationTime }, PacketType.SIGN_IN_RESPONSE);
};
