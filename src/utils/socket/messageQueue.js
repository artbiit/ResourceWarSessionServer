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

const getUserQueue = (id) => {
  const userQueues = queueBySocket[id];
  if (!userQueues) {
    logger.warn(`Unknown user queue. is Empty : ${id}`);
  }
  return userQueues;
};

export const enqueueSend = (id, buffer) => {
  getUserQueue(id).sendQueue.push(buffer);
};

export const countSend = (id) => {
  return getUserQueue(id).sendQueue.length;
};

export const dequeueSend = (id) => {
  return getUserQueue(id).sendQueue.shift();
};

export const enqueueReceive = (id, buffer) => {
  getUserQueue(id).receiveQueue.push(buffer);
};

export const countReceive = (id) => {
  return getUserQueue(id).receiveQueue.length;
};

export const dequeueReceive = (id) => {
  return getUserQueue(id).receiveQueue.shift();
};
