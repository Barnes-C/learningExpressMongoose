import { format, createLogger, transports, addColors } from 'winston';
import { loglevels, fileOptions, consoleOptions } from './config/logger';

addColors(loglevels.colors);

const { combine, colorize, simple } = format;

export const logger = createLogger({
    levels: loglevels.levels,
    format: combine(colorize(), simple()),
    transports: [
        new transports.Console(consoleOptions),
        new transports.File(fileOptions),
    ],
    level: 'custom',
});
