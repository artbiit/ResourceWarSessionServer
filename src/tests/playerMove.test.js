import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
const { PacketType } = configs;

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();
client.addHandler(PacketType.SYNC_PLAYERS_NOTIFICATION, async (payload) => {
  // console.log(payload);
});
client.sendMessage(PacketType.PLAYER_MOVE, {
  position : {x : 5, y : 5, z : 5},
});
