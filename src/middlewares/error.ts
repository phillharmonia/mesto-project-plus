import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import {getErrorMessage} from "../utills";

const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: './logs/error.log' }),
  ],
  format: winston.format.json(),
});

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const errorMessage = getErrorMessage(statusCode);
  const errorDetails = err.message || 'Internal Server Error';

  errorLogger.error({
    message: errorMessage,
    error: errorDetails,
    status: statusCode
  });

  return res.status(statusCode).json({ message: errorMessage });
};