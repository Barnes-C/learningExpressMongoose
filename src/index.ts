import dotenv from 'dotenv';
const result = dotenv.config();
if (result.error !== undefined) {
    throw result.error;
}

import { createServer } from 'http';
import { connection } from 'mongoose';
import app from './app';
import { logger } from './shared/logger';

import type { RequestListener } from 'http';
import type { Server } from 'net';

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
        logger.info(`Server started on port ${port}`),
    );
    process.on('SIGINT', shutdown);
    process.once('SIGUSR2', disconnectDB);
};

startServer();
