const { createServer } = require('http');
const { connection } = require('mongoose');
const app = require('./app');

const logger = require('./middleware/logger');

const port = process.env.PORT || 5000;

const disconnectDB = () => {
  connection.close().catch(() => process.exit(0));
};

const shutdown = () => {
  logger.info('Server is being shutdown');
  disconnectDB();
  process.exit(0);
};

const startServer = () => {
  createServer(app).listen(port, () =>
    logger.info(`Server started @ port ${port}`)
  );
  // <Ctrl>C
  process.on('SIGINT', shutdown);

  // nodemon uses SIGUSR2
  process.once('SIGUSR2', disconnectDB);
};

startServer();

// Check if JWT_KEY is used from nodemon.json in user route
