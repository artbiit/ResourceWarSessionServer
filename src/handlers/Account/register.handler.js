import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
import Result from '../result.js';
import bcrypt from 'bcryptjs';
import { getRedis } from '../../db/redis.js';
import { postgres } from '../../db/postgresql.js';
import { registerRequest } from '../../db/Account/register.db.js';

// 환경 변수에서 설정 불러오기
const { PacketType, SECURE_PEPPER, SECURE_SALT } = configs;

/***
 * - 회원가입 요청(request) 함수
 *
 * 클라이언트에서 받은 회원가입 정보를 MySQL에 등록해주는 함수.
 *
 * @param {string} param.payload.id - 유저의 ID
 * @param {string} param.payload.password - 유저의 비밀번호
 * @param {string} param.payload.nickname - 유저의 닉네임
 *
 * @returns {void} 별도의 반환 값은 없으며, 성공 여부와 메시지를 클라이언트에게 전송.
 */
export const registerRequestHandler = async ({ payload }) => {
  const { id, password, nickname } = payload;
  const signUpResultCode = registerRequest(id, password, nickname);

  return new Result({ signUpResultCode }, PacketType.SIGN_UP_RESPONSE);
};
