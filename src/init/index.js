// 서버 초기화 작업
import { getProtoMessages, loadProtos } from './loadProtos.js';
import { postgres } from '../db/postgresql.js';
import logger from '../utils/logger.js';
import { connect } from '../db/redis.js';
//import matchMaker from '../classes/models/matchMaker.class.js';

const initServer = async () => {
  try {
    await Promise.all([loadProtos(), postgres.init(), connect()]);
    logger.info('-------Data Layer initialized--------');
    //await Promise.all([matchMaker.init()]);
    logger.info('All initialized.');
    // 다음 작업
  } catch (e) {
    logger.error(e);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;

// await initServer();
// process.exit(1);
