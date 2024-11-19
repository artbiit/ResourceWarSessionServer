import { SignUpResultCode } from './accountConstant.js';
import bcrypt from 'bcryptjs';
import { postgres } from '../../db/postgresql.js';
import configs from '../../configs/configs.js';

const { SECURE_PEPPER, SECURE_SALT } = configs;

export const registerRequest = async (id, password, nickname) => {
  let signUpResultCode = SignUpResultCode.ERROR;

  //아이디, 비밀번호, 닉네임 유효성 검사
  const idRegex = /^[a-zA-Z0-9]{6,16}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*[ㄱ-ㅎ가-힣]).{6,16}$/;
  const nicknameRegex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9_]{2,16}$/;

  if (!idRegex.test(id)) {
    signUpResultCode = SignUpResultCode.ID_INVALID;
  } else if (!passwordRegex.test(password)) {
    signUpResultCode = SignUpResultCode.PW_INVALID;
  } else if (!nicknameRegex.test(nickname)) {
    signUpResultCode = SignUpResultCode.NN_INVALID;
  }

  // 아이디 기반으로 유저 찾기
  // 회원가입
  const salt = await bcrypt.genSalt(Number(SECURE_SALT));
  const hashedPassword = await bcrypt.hash(password + SECURE_PEPPER, salt);
  const insertUser = async (Account) => {
    const check = await postgres.execute(`SELECT id FROM Account WHERE nickname = ($1);`, [
      Account.id,
    ]);
    if (!check) {
      const result = await postgres.execute(
        `INSERT INTO Account (nickname, user_name, password, create_at, update_at) VALUES ($1, $2, $3, DEFAULT, DEFAULT) RETURNING id`,
        [nickname, id, hashedPassword],
      );
      signUpResultCode = SignUpResultCode.SUCCESS;
    } else {
      signUpResultCode = SignUpResultCode.DUPLICATE;
    }
  };

  await insertUser(Account);

  return signUpResultCode;
};
