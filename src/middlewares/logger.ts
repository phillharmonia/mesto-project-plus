import expressWinston from 'express-winston';
import winston from "winston";

const requestTransport = new winston.transports.File({
  filename: './logs/request.log',
  format: winston.format.json(),
});

export const requestLogger = expressWinston.logger({
  transports: [requestTransport],
});
