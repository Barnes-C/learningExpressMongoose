const JSON5 = require('json5');
const { MongoClient } = require('mongodb');
const logger = require('../../logger');
const { dbConfig } = require('./db');

const connectMongoDBClient = async () => {
  const { dbName, url } = dbConfig;
  logger.debug(`mongodb.connectMongoDB(): url=${url}`);
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  logger.debug('mongodb.connectMongoDB(): DB-Client geoeffnet');
  const db = client.db(dbName);

  return { db, client };
};

const closeMongoDBClient = (client) => {
  client
    .close()
    .then(() =>
      logger.debug('mongodb.closeDbClient(): DB-Client wurde geschlossen')
    )
    .catch((err) =>
      logger.error(`mongodb.closeDbClient(): ${JSON5.stringify(err)}`)
    );
};

module.exports = { connectMongoDBClient, closeMongoDBClient };
