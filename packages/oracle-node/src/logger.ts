import winston = require('winston');

export const appLogger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});
