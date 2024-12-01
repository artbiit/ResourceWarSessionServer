import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
const { PacketType } = configs;

const clients = [];
for (let i = 0; i < 10; i++) {
  const client = new Client(testEnv.url, testEnv.port);
  await client.connect();
  client.token = 'master' + i;
  clients.push(client);
}

await new Promise((resolve) => setTimeout(resolve, 5000));

for (let i = 0; i < clients.length; i++) {
  if (i % 2) {
    await clients[i].sendMessage(PacketType.AUTHORIZE_REQUEST, {});
  }
}
