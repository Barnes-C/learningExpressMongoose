// -----------------------------------------------------------------------------
// U m g e b u n g s v a r i a b l e
// -----------------------------------------------------------------------------
const { DB_NAME, DB_HOST, DB_USER, DB_PASS } = process.env; // eslint-disable-line no-process-env

// -----------------------------------------------------------------------------
// E i n s t e l l u n g e n
// -----------------------------------------------------------------------------
const dbName = DB_NAME ?? 'website';
const atlas = DB_HOST?.endsWith('mongodb.net') ?? false;
const host = DB_HOST ?? 'barnescluster0.wmnj6.mongodb.net';
const user = DB_USER ?? 'BarnesC';
const pass = DB_PASS ?? 'p';

const url = `mongodb+srv://${user}:${pass}@${host}/${dbName}?retryWrites=true&w=majority`;
const adminUrl = `mongodb://${user}:${pass}@${host}/admin`;

const dbConfig = {
  atlas,
  url,
  adminUrl,
  dbName,
  host,
  user,
  pass,
};

module.exports = { dbConfig };
