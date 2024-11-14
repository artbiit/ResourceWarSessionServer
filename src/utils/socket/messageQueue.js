import logger from '../logger.js';

const queueBySocket = {};

export const addUserQueue = (socket) => {
  //userId로 전환해야 연결이 끊겼다 들어와도 다시 큐에 정상처리 될듯?
  const id = socket.id;
  if (queueBySocket[id]) {
    //기존 큐를 비워야할지도 고민해봐야 할듯
    logger.warn(`addUserQueue. already exists queue : ${id}`);
    queueBySocket[id].socket = socket;
  } else {
    queueBySocket[id] = {
      socket,
      receiveQueue: [],
      sendQueue: [],
    };
  }
};

console.log();

export const enqueueSend = (id, buffer) => {
  const userQueues = queueBySocket[id];
  if (userQueues) {
    userQueues.sendQueue.push(buffer);
  } else {
    logger.warn(`enqueueSend. unknown user : ${id}`);
  }
};

export const countSend = (id) => {};
