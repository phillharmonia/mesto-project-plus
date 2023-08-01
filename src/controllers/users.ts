import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  STATUS_OK,
} from '../constants/statusCodes';
import User, { IUser } from '../models/user';
import { IRequest } from '../types/Request';
import { AppError } from '../utills';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const userData: IUser = {
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      };

      return User.create(userData);
    })
    .then((newUser) => {
      const { password: hashedPassword, ...user } = newUser.toObject();
      return res.status(STATUS_OK).json({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(AppError.BadRequest('Переданы некорректные данные при создании пользователя'));
      } if (err.code === 11000) {
        return next(AppError.BadRequest('Пользователь с таким email уже существует'));
      }
      return next(AppError.ServerError('Произошла ошибка'));
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      bcrypt.compare(password, user!.password)
        .then((isMatch) => {
          if (!isMatch) {
            return next(AppError.Unauthorized('Неправильная почта или пароль'));
          }

          const payload = {
            _id: user!._id,
          };

          const token = jwt.sign(payload, 'some-secret-key', { expiresIn: '7d' });

          return res.status(STATUS_OK).json({ token, message: 'Авторизация прошла успешно' });
        });
    })
    .catch(() => next(AppError.ServerError('Произошла ошибка')));
};

export const getCurrentUser = (req: IRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  User.findById(userId)
    .then((user: IUser | null) => res.status(STATUS_OK).json({ data: user }))
    .catch(() => next(AppError.ServerError('Произошла ошибка')));
};
export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.status(STATUS_OK).json({ data: users }))
  .catch(() => next(AppError.ServerError('Произошла ошибка')));

export const getUsersById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => res.status(STATUS_OK).json({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(AppError.BadRequest('Некорректный формат _id'));
      }
      return next(AppError.ServerError('Произошла ошибка'));
    });
};

export const updateUser = (req: IRequest, res: Response, next: NextFunction) => {
  const {
    name,
    about,
  } = req.body;
  const userId = req.user?._id;

  return User.findByIdAndUpdate(userId, {
    name,
    about,
  }, { new: true, runValidators: true })
    .then((updatedUser) => res.status(STATUS_OK).json({ data: updatedUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(AppError.BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      return next(AppError.ServerError('Произошла ошибка'));
    });
};

export const updateUserAvatar = (req: IRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => res.status(STATUS_OK).json({ data: updatedUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(AppError.BadRequest('Переданы некорректные данные при обновлении аватара'));
      }
      return next(AppError.ServerError('Произошла ошибка'));
    });
};
