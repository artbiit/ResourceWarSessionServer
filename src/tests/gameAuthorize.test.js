import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
const { PacketType } = configs;

const client = getOrCreateClient('127.0.0.1', 15112);
await client.connect();
client.token = '7b5e6aa1-87f2-4174-8996-f827012d2e8a';
client.addHandler(PacketType.AUTHORIZE_RESPONSE, async (payload) => {});
client.sendMessage(PacketType.AUTHORIZE_REQUEST, {});
