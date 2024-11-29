import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
const { PacketType } = configs;

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();
client.token = "7b5e6aa1-87f2-4174-8996-f827012d2e8a";
client.addHandler(PacketType.JOIN_ROOM_RESPONSE, async (payload) => {
  // console.log(payload);
});
client.sendMessage(PacketType.JOIN_ROOM_REQUEST, {
  gameCode : "asdasd",
});

client.addHandler(PacketType.SYNC_PLAYERS_NOTIFICATION, async (payload) => {
  // console.log(payload);
});
// client.sendMessage(PacketType.PLAYER_MOVE, {
//   position: { x: 1, y: 0, z: 1 },
// });
// 100ms 간격으로 position을 보내는 예시
const intervalId = setInterval(() => {
  client.sendMessage(PacketType.PLAYER_MOVE, {
    position: { x: 1, y: 0, z: 1 }
  });
}, 1000); // 100ms 간격으로 실행

client.addHandler(PacketType.PING_REQUEST, async (payload) => {
  //console.log('페이로드 : ', payload);
  client.sendMessage(PacketType.PONG_RESPONSE, {
    clientTime: Date.now(),
  });
});
