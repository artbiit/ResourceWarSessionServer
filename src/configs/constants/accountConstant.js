export const SignInResultCode = {
  SUCCESS: 0,
  INVALID_ID: 1,
  INVALID_PW: 2,
  ALREADY_LOGGED_IN: 3,
  UNKNOWN_ERROR: 20000,
};

export const SignUpResultCode = {
  SUCCESS: 0,
  ID_INVALID: 1,
  PW_INVALID: 2,
  NN_INVALID: 3,
  DUPLICATE_USER_NAME: 5,
  DUPLICATE_NICKNAME: 6,
  FAILED_CREATE: 10000,
  UNKNOWN_ERROR: 20000,
};

export const RefreshTokenResultCode = {
  SUCCESS: 0, //성공
  EXPIRED_TOKEN: 1, //만료된 토큰
  INVALID_TOKEN: 2, //잘못된 토큰
  UNKNOWN_USERNAME: 3, //등록된 적 없는 계정임
  MISMATCH_TOKEN_USERNAME: 4, //해당 계정에 발급된 토큰과 같지 않음.
  UNKNOWN_ERROR: 20000, //알 수 없는 문제 발생
};
