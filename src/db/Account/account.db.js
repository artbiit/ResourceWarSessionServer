import { postgres } from '../postgresql.js';
import Account_Qry from './account.qry.js';
await postgres.init();

export const findUserByUserName = async (userName) => {
  let result = await postgres.query(Account_Qry.FIND_USER_BY_USERNAME, [userName]);
  if (result.rows.length) {
    result = result.rows[0];
    result.user_name = userName;
  } else {
    result = null;
  }
  return result;
};

export const findUserById = async (id) => {
  let result = await postgres.query(Account_Qry.FIND_USER_BY_ID, [id]);
  if (result.rows.length) {
    result = result.rows[0];
    result.id = id;
  } else {
    result = null;
  }
  return result;
};

/**
 *  이미 존재할 경우 conflict_type이 정의됩니다. 'user_name'은 계정 중복, 'nickname'은 닉네임 중복
 */
export const existsByUserNameAndNickname = async (userName, nickname) => {
  let result = await postgres.query(Account_Qry.EXISTS_USER_BY_USERNAME_AND_NICKNAME, [
    userName,
    nickname,
  ]);

  if (result.rows.length) {
    result = result.rows[0].conflict_type;
  } else {
    result = null;
  }
  return result;
};

/**
 * 정상적으로 처리시 생성된 id 값 반환합니다.
 */
export const createUser = async (userName, hashedPassword, nickname) => {
  let result = await postgres.execute(Account_Qry.INSERT_USER, [
    nickname,
    userName,
    hashedPassword,
  ]);

  if (result.rows.length) {
    result = result.rows[0].id;
  } else {
    result = null;
  }

  return result;
};
