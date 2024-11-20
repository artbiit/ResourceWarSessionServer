import { v4 as uuidv4 } from 'uuid';

//아이디, 비밀번호, 닉네임 유효성 검사
const userNameRegex = /^[a-zA-Z0-9]{6,36}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,36}$/;
const nicknameRegex = /^[a-zA-Z0-9ㄱ-ㅎ가-힣_]{2,16}$/;

export const isUserNameMatch = (userName) => {
  return userNameRegex.test(userName);
};

export const isPasswordMatch = (password) => {
  return passwordRegex.test(password);
};

export const isNicknameMatch = (nickname) => {
  return nicknameRegex.test(nickname);
};

export const createNewToken = () => {
  return { token: uuidv4(), expirationTime: Date.now() + 3600000 };
};
