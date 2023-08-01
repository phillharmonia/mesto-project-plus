import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { AppError } from '../utills';

interface IAuth extends Request {
  user?: string | JwtPayload
}
const authMiddleware = (req: IAuth, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(AppError.Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, 'some-secret-key');

    req.user = payload;
    next();
  } catch (err) {
    return next(AppError.Unauthorized('Неверный токен авторизации'));
  }
};

export default authMiddleware;
