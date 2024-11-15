import fs from 'fs';
import configs from '../configs/configs.js';
import logger from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;
// 현재 파일의 절대 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT } = configs;

class PostgresService {
  dmlQueue = [];
  queryQueue = [];
  processingDml = false;
  processingQuery = false;

  constructor() {
    this.pool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      max: DB_CONNECTION_LIMIT, // 최대 커넥션 수
      idleTimeoutMillis: 30000, // 사용되지 않는 연결을 닫는 시간 설정
      connectionTimeoutMillis: 2000, // 연결 타임아웃 설정
    });
  }

  async init() {
    await this.createTables();
    logger.info('PostgreSQL initialized');
  }

  async createTables() {
    const text = fs.readFileSync(path.join(__dirname, `sql/schema.sql`), 'utf-8');

    const jobs = [];
    text.split(';').forEach((qry) => {
      if (!qry.trim()) {
        return;
      }
      jobs.push(this.execute(qry));
    });
    await Promise.all(jobs);
  }

  addToQueue(queue, query, params) {
    return new Promise((resolve, reject) => {
      queue.push({ query, params, resolve, reject });
      this.processQueue(queue);
    });
  }

  async processQueue(queue) {
    if (queue === this.dmlQueue && this.processingDml) return;
    if (queue === this.queryQueue && this.processingQuery) return;

    if (queue.length > 0) {
      const current = queue.shift();
      if (queue === this.dmlQueue) this.processingDml = true;
      if (queue === this.queryQueue) this.processingQuery = true;

      try {
        const result = await this.pool.query(current.query, current.params);
        current.resolve(result);
      } catch (error) {
        logger.error(`PostgresService.processQueue error: ${error}`);
        current.reject(error);
      } finally {
        if (queue === this.dmlQueue) this.processingDml = false;
        if (queue === this.queryQueue) this.processingQuery = false;

        this.processQueue(queue);
      }
    }
  }

  async execute(qry, params) {
    return this.addToQueue(this.dmlQueue, qry, params);
  }

  async query(qry, params) {
    return this.addToQueue(this.queryQueue, qry, params);
  }

  async transaction(querySet) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for (let set of querySet) {
        await client.query(set.qry, set.params);
      }
      await client.query('COMMIT');
    } catch (error) {
      logger.error(`PostgresService.transaction error: ${error}`);
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

const postgresService = new PostgresService();

export { postgresService as postgres };
