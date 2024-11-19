import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';

const { PacketType } = configs;

const client = getOrCreateClient('localhost', 5555);
await client.connect();

client.addHandler(PacketType.SIGN_IN_RESPONSE, async (payload) => {
  // console.log(payload);
});
client.sendMessage(PacketType.SIGN_IN_REQUEST, {
  id: '실험용 아이디',
  password: '박용현죽어라',
});
