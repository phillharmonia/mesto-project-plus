import {
  Errback,
  Request,
  Response,
} from 'express';
import { AppError } from '../utills';

export default function errorHandler(err: Errback, _req: Request, res: Response) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Произошла ошибка' });
}
