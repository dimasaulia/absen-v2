import winston = require('winston');

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logfile.log',
      format: winston.format.json(), // Keeps JSON format for file logs
    }),
  ],
});
