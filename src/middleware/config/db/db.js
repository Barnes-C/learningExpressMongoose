const JSON5 = require('json5');
const logger = require('../../logger');

// -----------------------------------------------------------------------------
// U m g e b u n g s v a r i a b l e
// -----------------------------------------------------------------------------
const {
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_POPULATE,
  MOCK_DB,
} = process.env; // eslint-disable-line no-process-env

// -----------------------------------------------------------------------------
// E i n s t e l l u n g e n
// -----------------------------------------------------------------------------
const dbName = DB_NAME ?? 'member';
const atlas = DB_HOST?.endsWith('mongodb.net') ?? false;
const host = DB_HOST ?? 'barnescluster0.wmnj6.mongodb.net';
const user = DB_USER ?? 'BarnesC';
const pass = DB_PASS ?? 'p';
const dbPopulate = DB_POPULATE !== undefined;

const url = `mongodb+srv://${user}:${pass}@${host}/${dbName}?retryWrites=true&w=majority`;
const adminUrl = `mongodb://${user}:${pass}@${host}/admin`;

const mockDB = MOCK_DB === 'true';

const dbConfig = {
  atlas,
  url,
  adminUrl,
  dbName,
  host,
  user,
  pass,
  dbPopulate,
  mockDB,
};

const dbConfigLog = {
  atlas,
  url: url.replace(/\/\/.*:/u, '//USERNAME:@').replace(/:[^:]*@/u, ':***@'),
  adminUrl: adminUrl
    .replace(/\/\/.*:/u, '//USERNAME:@')
    .replace(/:[^:]*@/u, ':***@'),
  dbName,
  host,
  dbPopulate,
  mockDB,
};

logger.info(`dbConfig: ${JSON5.stringify(dbConfigLog)}`);

module.exports = { dbConfig };
