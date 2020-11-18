const { DB_NAME, DB_HOST, DB_USER, DB_PASS } = process.env; // eslint-disable-line no-process-env

const dbName = DB_NAME ?? 'name';
const atlas = DB_HOST?.endsWith('mongodb.net') ?? false;
const host = DB_HOST ?? 'cluster0.mongodb.net';
const user = DB_USER ?? 'admin';
const pass = DB_PASS ?? 'p';

const url = `mongodb+srv://${user}:${pass}@${host}/${dbName}?retryWrites=true&w=majority`;
const adminUrl = `mongodb://${user}:${pass}@${host}/admin`;

export const dbConfig = {
    atlas,
    url,
    adminUrl,
    dbName,
    host,
    user,
    pass,
};
