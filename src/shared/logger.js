// https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/
const { format, createLogger, transports } = require('winston');
const { loglevels, fileOptions, consoleOptions } = require('./config/logger');

const { combine, colorize, simple } = format;
const { File } = transports;

const logger = createLogger({
  levels: loglevels.levels,
  format: combine(colorize(), simple()),
  transports: [new transports.Console(consoleOptions), new File(fileOptions)],
  level: 'custom',
});

module.exports = logger;
