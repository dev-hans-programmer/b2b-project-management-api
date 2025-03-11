import winston from 'winston';
import { config } from './app.config';

export const logger = winston.createLogger({
   level: 'info',
   format: winston.format.combine(
      winston.format.timestamp({
         format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json()
   ),
   defaultMeta: { service: 'b2b-project-management-api' },
   transports: [
      new winston.transports.File({
         filename: 'logs/error.log',
         level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
   ],
});

if (config.NODE_ENV !== 'production') {
   logger.add(
      new winston.transports.Console({
         format: winston.format.json(),
      })
   );
}
