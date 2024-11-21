export const SignInResultCode = {
  SUCCESS: 0, //성공
  INVALID_ID: 1, //알 수 없는 아이디
  INVALID_PW: 2, //비밀번호 일치하지 않음
  ALREADY_LOGGED_IN: 3, //중복 로그인
  UNKNOWN_ERROR: 20000, //알 수 없음
};

export const SignUpResultCode = {
  SUCCESS: 0, //가입완료
  ID_INVALID: 1, //아이디 규격 통과 실패
  PW_INVALID: 2, //비번 규격 통과 실패
  NN_INVALID: 3, //닉네임 규격 통과 실패
  DUPLICATE_USER_NAME: 5, //이미 존재하는 계정
  DUPLICATE_NICKNAME: 6, //이미 존재하는 닉네임
  FAILED_CREATE: 10000, //생성중 문제 발생
  UNKNOWN_ERROR: 20000, //알 수 없는 문제 발생
};

export const RefreshTokenResultCode = {
  SUCCESS: 0, //성공
  EXPIRED_TOKEN: 1, //만료된 토큰
  INVALID_TOKEN: 2, //잘못된 토큰
  UNKNOWN_USERNAME: 3, //등록된 적 없는 계정임
  MISMATCH_TOKEN_USERNAME: 4, //해당 계정에 발급된 토큰과 같지 않음.
  UNKNOWN_ERROR: 20000, //알 수 없는 문제 발생
};
