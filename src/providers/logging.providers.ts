import winston = require('winston');

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${String(level)}]: ${message}`;
});

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: 'logfile.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        logFormat
      ), // Keeps JSON format for file logs
    }),
  ],
});
