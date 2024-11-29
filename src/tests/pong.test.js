import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
const { PacketType } = configs;

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();
//client.token = "7b5e6aa1-87f2-4174-8996-f827012d2e8a";
client.addHandler(PacketType.PONG_REQUEST, async (payload) => {
  // console.log(payload);
});
client.sendMessage(PacketType.PONG_RESPONSE, {
    clientTime : Date.now(),
});