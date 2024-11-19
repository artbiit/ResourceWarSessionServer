//아이디, 비밀번호, 닉네임 유효성 검사
const userNameRegex = /^[a-zA-Z0-9]{6,16}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*[ㄱ-ㅎ가-힣]).{6,16}$/;
const nicknameRegex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9_]{2,16}$/;

export const isUserNameMatch = (userName) => {
  return userNameRegex.test(userName);
};

export const isPasswordMatch = (password) => {
  return passwordRegex.test(password);
};

export const isNicknameMatch = (nickname) => {
  return nicknameRegex.test(nickname);
};
