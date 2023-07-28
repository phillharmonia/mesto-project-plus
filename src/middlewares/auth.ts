import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { STATUS_UNAUTHORIZED } from '../constants/statusCodes';

interface IAuth extends Request {
  user?: string | JwtPayload
}
const authMiddleware = (req: IAuth, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .json({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, 'some-secret-key');

    req.user = payload;
    next();
  } catch (err) {
    return res.status(STATUS_UNAUTHORIZED).json({ message: 'Неверный токен авторизации' });
  }
};

export default authMiddleware;
