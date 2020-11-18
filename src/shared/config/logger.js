// Winston: seit 2010 bei GoDaddy (Registrierung von Domains)
// Log-Levels: error, warn, info, debug, verbose, silly, ...
// Medien (= Transports): Console, File, ...
// https://github.com/winstonjs/winston/blob/master/docs/transports.md
// Alternative: Bunyan, Pino

const winston = require('winston');

const { colorize, combine, json, simple, timestamp } = winston.format;

//
// Logging levels
//
const loglevels = {
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
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'yellow',
  },
};

winston.addColors(loglevels.colors);

const consoleFormat = combine(colorize(), simple());
const consoleOptions = {
  format: consoleFormat,
};

const fileOptions = {
  filename: 'server.log',
  // 250 KB
  maxsize: 250000,
  maxFiles: 3,
  format: combine(timestamp(), json()),
};

module.exports = { loglevels, fileOptions, consoleOptions };
