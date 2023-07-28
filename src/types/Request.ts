import { Request } from 'express';
import jwt from 'jsonwebtoken';

export interface IRequest extends Request {
    user?: {
      _id: string | jwt.JwtPayload;
    }
  }
