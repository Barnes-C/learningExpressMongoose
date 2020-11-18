import winston from 'winston';
const { colorize, combine, json, simple, timestamp } = winston.format;

//
// Logging levels
//
export const loglevels = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7,
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'orange',
        data: 'grey',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'yellow',
    },
};

export const consoleFormat = combine(colorize(), simple());

export const consoleOptions = {
    format: consoleFormat,
};

export const fileOptions = {
    filename: 'server.log',
    // 250 KB
    maxsize: 250000,
    maxFiles: 3,
    format: combine(timestamp(), json()),
};
