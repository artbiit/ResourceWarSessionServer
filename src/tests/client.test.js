import net from 'net';
import { loadProtos, getProtoMessages } from '../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../handlers/index.js';
import configs from '../configs/configs.js';
import { createPacket } from '../utils/packet/createPacket.js';
import { packetParser } from '../utils/packet/packetParser.js';
await loadProtos();

const {
  PACKET_TYPE_LENGTH,
  PACKET_TOTAL_LENGTH,
  PACKET_TOKEN_LENGTH,
  PACKET_PAYLOAD_LENGTH,
  CLIENT_VERSIONS,
  PacketType,
} = configs;

const connections = [];

class Client {
  userId = '';
  token = '';
  #handlers = {};

  constructor(host = 'localhost', port = 5555) {
    this.host = host;
    this.port = port;
    this.client = null;
    this.buffer = Buffer.alloc(0);
  }

  addHandler = (packetType, handler) => {
    if (this.#handlers[packetType]) {
      console.warn(
        `이미 등록된 핸들러가 있으나 교체 합니다. [${packetType}]\n기존 핸들러 : ${this.#handlers[packetType]}`,
      );
    }

    this.#handlers[packetType] = handler;
  };

  getNextSequence = () => {
    return ++this.sequence;
  };

  connect = () => {
    return new Promise((resolve, reject) => {
      if (this.client) {
        resolve();
        return;
      }

      this.client = net.createConnection({ host: this.host, port: this.port }, () => {
        connections.push(this);
        console.log('서버에 연결되었습니다.');
        this.addHandler(PacketType.MISSING_FIELD, ({ payload }) => {
          console.error(`${[PacketType.MISSING_FIELD]} => `, payload);
        });
        resolve();
      });

      this.client.on('data', this.#onData);

      this.client.on('end', () => {
        this.client = null;
        console.log('서버와의 연결이 종료되었습니다.');
      });

      this.client.on('error', (err) => {
        this.client = null;
        console.error('서버 연결 중 에러 발생:', err.message);
        reject(err);
      });
    });
  };

  sendMessage = async (packetType, data) => {
    if (!this.client) {
      throw new Error('서버에 연결되어 있지 않습니다.');
    }
    console.log(`Client Send : [${packetType}] `, data);
    const wrappedPacket = createPacket(packetType, this.token, data);
    await this.client.write(wrappedPacket);
  };

  #onData = async (data) => {
    this.buffer = Buffer.concat([this.buffer, data]);

    while (this.buffer.length >= PACKET_TOTAL_LENGTH) {
      const packetType = this.buffer.readUintBE(0, PACKET_TYPE_LENGTH);
      const tokenLength = this.buffer.readUintBE(PACKET_TYPE_LENGTH, PACKET_TOKEN_LENGTH);
      let offset = PACKET_TYPE_LENGTH + PACKET_TOKEN_LENGTH;
      const token = this.buffer.subarray(offset, offset + tokenLength).toString();
      offset += tokenLength;
      const payloadLength = this.buffer.readUintBE(offset, PACKET_PAYLOAD_LENGTH);
      offset += PACKET_PAYLOAD_LENGTH;
      const requiredLength = offset + payloadLength;

      if (this.buffer.length >= requiredLength) {
        const payloadData = this.buffer.subarray(offset, requiredLength);
        this.buffer = this.buffer.subarray(requiredLength);

        const payload = packetParser(packetType, payloadData);
        const handler = this.#handlers[packetType];

        console.log(`수신[packetType:${packetType}]\n`, payload);

        if (handler) {
          await handler({ payload });
        } else {
          console.log(`등록되지 않은 핸들러 : [${packetType}]\n${payload}`);
        }
      } else {
        break;
      }
    }
  };

  disconnect = () => {
    if (this.client) {
      this.client.end();
      console.log('서버 연결이 종료되었습니다.');
      this.client = null;
    }
  };
}

/**
 * 같은 연결의 클라이언트가 있으면 반환합니다. 없으면 생성합니다. connect() 는 직접 호출해야 합니다.
 */
export const getOrCreateClient = (host, port) => {
  let conn = connections.find((conn) => conn.host == host && conn.port == port);
  if (!conn) {
    conn = new Client(host, port);
  }
  return conn;
};

process.on('exit', (code) => {
  allDisconnect();
});

process.on('SIGTERM', () => {
  allDisconnect();
  process.exit();
});

process.on('SIGTERM', () => {
  allDisconnect();
  process.exit();
});

function allDisconnect() {
  connections.forEach((conn) => conn.disconnect());
}

export default Client;
