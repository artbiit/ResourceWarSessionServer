import { getHandlerById } from '../../handlers/index.js';
import Result from '../../handlers/result.js';
import { handleError } from '../error/errorHandler.js';
import logger from '../logger.js';
import { createPacket } from '../packet/createPacket.js';
import configs from '../../configs/configs.js';

const { PacketType } = configs;
const queueBySocket = {};

export const addUserQueue = (socket) => {
  //userId로 전환해야 연결이 끊겼다 들어와도 다시 큐에 정상처리 될듯?
  const id = socket.id;
  if (queueBySocket[id]) {
    //기존 큐를 비워야할지도 고민해봐야 할듯
    logger.warn(`addUserQueue. already exists queue : ${id}`);
    queueBySocket[id].socket = socket;
    queueBySocket[id].receiveQueue = queueBySocket[id].receiveQueue || [];
    queueBySocket[id].sendQueue = queueBySocket[id].sendQueue || [];
  } else {
    queueBySocket[id] = {
      socket,
      receiveQueue: [],
      processingReceive: false,
      sendQueue: [],
      processingSend: false,
    };
  }
};

export const removeUserQueue = (socket) => {
  const id = socket.id;
  if (queueBySocket[id]) {
    delete queueBySocket[id];
  } else {
    logger.warn(`removeUserQueue. ${id || 'Undefined'} is unknown socket`);
  }
};

const getUserQueue = (socketId) => {
  const userQueues = queueBySocket[socketId];
  if (!userQueues) {
    logger.error(`Unknown user queue. is Empty : ${socketId}`);
  }
  return userQueues;
};

export const enqueueSend = (socketId, buffer) => {
  const userQueue = getUserQueue(socketId);
  if (userQueue) {
    userQueue.sendQueue.push(buffer);
    processSendQueue(socketId);
  } else {
    logger.error(`enqueueSend. ${socketId} is unknown user`);
  }
};

export const countSend = (socketId) => {
  const userQueue = getUserQueue(socketId);
  let count = 0;
  if (userQueue) {
    count = userQueue.sendQueue.length;
  } else {
    logger.warn(`countSend. ${socketId} is unknown user`);
  }
  return count;
};

export const dequeueSend = (socketId) => {
  return getUserQueue(socketId).sendQueue.shift();
};

export const enqueueReceive = (socketId, packetType, payload) => {
  const userQueue = getUserQueue(socketId);
  if (userQueue) {
    userQueue.receiveQueue.push({ packetType, payload });
    processReceiveQueue(socketId);
  } else {
    logger.error(`enqueueReceive. ${socketId} is unknown user`);
  }
};

export const countReceive = (socketId) => {
  const userQueue = getUserQueue(socketId);
  let count = 0;
  if (userQueue) {
    count = userQueue.receiveQueue.length;
  } else {
    logger.warn(`countReceive. ${socketId} is unknown user`);
  }
  return count;
};

export const dequeueReceive = (socketId) => {
  return getUserQueue(socketId).receiveQueue.shift();
};

const processSendQueue = async (socketId) => {
  const userQueue = getUserQueue(socketId);
  if (!userQueue) return;
  if (userQueue.processingSend === true) return;
  userQueue.processingSend = true;

  const { sendQueue, socket } = userQueue;

  // 큐에서 메시지를 하나 꺼내 처리
  while (sendQueue.length > 0) {
    const message = sendQueue.shift();
    if (message) {
      try {
        await socket.write(message);
      } catch (err) {
        logger.error(`Failed to send message to socket ${socketId}: ${err}`);
      }
    }
  }

  userQueue.processingSend = false;
};

const processReceiveQueue = async (socketId) => {
  const userQueue = getUserQueue(socketId);
  if (!userQueue) return;
  if (userQueue.processingReceive === true) return;
  userQueue.processingReceive = true;

  const { receiveQueue, socket } = userQueue;

  // 큐에서 메시지를 하나 꺼내 처리
  while (receiveQueue.length > 0) {
    const message = receiveQueue.shift();
    if (message) {
      const { packetType, payload } = message;
      let result = null;
      try {
        if (payload.missingFieldsLength > 0) {
          result = new Result(
            { packetType, missingFieldLength: payload.missingFieldsLength },
            PacketType.MISSING_FIELD,
          );
        } else {
          const handler = getHandlerById(packetType);
          if (handler) {
            result = await handler({ socket, payload });
          } else {
            logger.warn(`processReceiveQueue. Unknown handler Id : ${packetType}`);
          }
        }
      } catch (error) {
        result = handleError(packetType, error);
      } finally {
        if (result) {
          console.log(result);
          const response = createPacket(result.responseType, '', result.payload);
          enqueueSend(socketId, response);
        }
      }
    }
  }

  userQueue.processingReceive = false;
};
