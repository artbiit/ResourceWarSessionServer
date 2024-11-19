import logger from '../../utils/logger.js';
import configs from '../../configs/configs.js';
import Result from '../result.js';
import { createUser } from '../../db/Account/account.db.js';
import bcrypt from 'bcryptjs';
import { isUserNameMatch, isNicknameMatch, isPasswordMatch } from './helper.js';
import { existsByUserNameAndNickname } from '../../db/Account/account.db.js';
// 환경 변수에서 설정 불러오기
const { PacketType, SECURE_PEPPER, SECURE_SALT, SignUpResultCode } = configs;

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
  const { id: userName, password, nickname } = payload;
  let signUpResultCode = SignUpResultCode.ERROR;
  if (!isUserNameMatch(userName)) {
    signUpResultCode = SignUpResultCode.ID_INVALID;
  } else if (!isPasswordMatch.test(password)) {
    signUpResultCode = SignUpResultCode.PW_INVALID;
  } else if (!isNicknameMatch.test(nickname)) {
    signUpResultCode = SignUpResultCode.NN_INVALID;
  } else {
    try {
      const isExists = await existsByUserNameAndNickname(userName, nickname);
      if (isExists) {
        if (isExists.conflict_type == 'user_name') {
          signUpResultCode = SignUpResultCode.DUPLICATE_USER_NAME;
        } else if (isExists.conflict_type == 'nickname') {
          signUpResultCode = SignUpResultCode.DUPLICATE_NICKNAME;
        }
      } else {
        const hashedPassword = await bcrypt.hash(password + SECURE_PEPPER, SECURE_SALT);
        const result = await createUser(userName, hashedPassword, nickname);
        if (result === null) {
          signUpResultCode = SignUpResultCode.FAILED_CREATE;
        }
      }
    } catch (error) {
      signUpResultCode = SignUpResultCode.UNKNOWN_ERROR;
      logger.error(`registerRequestHandler. : ${error.message}`);
    }
  }

  return new Result({ signUpResultCode }, PacketType.SIGN_UP_RESPONSE);
};
