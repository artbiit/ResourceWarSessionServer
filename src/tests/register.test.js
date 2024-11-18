import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';

const { PacketType } = configs;

const client = getOrCreateClient('localhost', 5555);
await client.connect();

// client.addHandler(PacketType.SIGN_UP_RESPONSE, async (payload) => {
//   // console.log(payload);
// });

// client.sendMessage(PacketType.SIGN_UP_REQUEST, {
//   id: '실험용 아이디',
//   password: '박용현죽어라',
//   nickname: '문민철게으름',
// });

client.addHandler(PacketType.SIGN_IN_RESPONSE, async (payload) => {
  // console.log(payload);
});
client.sendMessage(PacketType.SIGN_IN_REQUEST, {
  id: '실험용 아이디',
  password: '박용현죽어라',
});

// client.addHandler(PacketType.CREATE_ROOM_RESPONSE, async (payload) => {
//   // console.log(payload);
// });
// client.sendMessage(PacketType.CREATE_ROOM_REQUEST, {
//   isPrivate: false,
// });

client.addHandler(PacketType.JOIN_ROOM_RESPONSE, async (payload) => {
  // console.log(payload);
});
client.sendMessage(PacketType.JOIN_ROOM_REQUEST, {
  gameCode : "992518",
});
