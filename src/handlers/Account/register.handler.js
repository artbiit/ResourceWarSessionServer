import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
import Result from '../result.js';
import bcrypt from 'bcryptjs';
import { getRedis } from '../../db/redis.js';
import { postgres } from '../../db/postgresql.js';

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
  let message = undefined;
  let success = true;
  let signUpResultCode = 0;

  try {
    // 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*[ㄱ-ㅎ가-힣]).{6,}$/;
    if (!passwordRegex.test(password)) {
      success = false;
      message =
        '비밀번호는 최소 대문자 1개와 특수문자 1개를 포함해야 하며, 한글을 포함할 수 없고, 최소 6자 이상입니다.';
    }

    // 아이디 기반으로 유저 찾기
    // 회원가입
    const salt = await bcrypt.genSalt(Number(SECURE_SALT));
    const hashedPassword = await bcrypt.hash(password + SECURE_PEPPER, salt);
    const Account = {
      id: id,
      nickname: nickname,
      password: hashedPassword,
      create_at: Date.now(),
      update_at: Date.now(),
    };
    const insertUser = async (Account) => {
      try {
        const check = await postgres.execute(`SELECT * FROM Account WHERE nickname = ($1);`, [
          Account.id,
        ]);
        if (!check) {
          const result = await postgres.execute(
            `INSERT INTO Account (nickname, user_name, password, create_at, update_at) VALUES ($1, $2, $3, DEFAULT, DEFAULT) RETURNING id`,
            [Account.nickname, Account.id, Account.password],
          );
          console.log('User inserted with ID:', result);
        }
        else{
          console.log('중복된 아이디 입니다.');
          signUpResultCode = 1;
        }
      } catch (e) {
        console.error(e);
      }
    };
    await insertUser(Account);

    message = '회원가입을 완료했습니다.';
  } catch (error) {
    success = false;
    message = '회원가입 과정 중 문제가 발생했습니다..';
    signUpResultCode = 1;
    logger.error(`registerRequestHandler Error: ${error.message}`);
  }

  return new Result({ signUpResultCode }, PacketType.SIGN_UP_RESPONSE);
};
