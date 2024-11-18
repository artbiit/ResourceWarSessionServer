import configs from '../../configs/configs.js';
import Result from '../result.js';
import { login } from '../../db/Account/login.db.js';

// 환경 변수에서 설정 불러오기
const { PacketType} = configs;

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
  const { signInResultCode, token, expirationTime } = await login(id, password, socket);
  return new Result({ signInResultCode, token, expirationTime }, PacketType.SIGN_IN_RESPONSE);
};
