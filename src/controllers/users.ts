import { Response, Request } from 'express';
import {
  STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_OK, STATUS_SERVER_ERROR,
} from '../constants/statusCodes';
import User from '../models/user';
import { IRequest } from '../types/Request';

export const createUser = (req: Request, res: Response) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  if (!name || !about || !avatar) {
    return res.status(STATUS_BAD_REQUEST)
      .json({ message: 'Неверные данные запроса, отсутствует имя, информация или аватар' });
  }
  return User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(STATUS_OK).json({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.status(STATUS_OK).json({ data: users }))
  .catch(() => res.status(STATUS_SERVER_ERROR)
    .json({ message: 'Произошла ошибка' }));

export const getUsersById = (req: Request, res: Response) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(STATUS_NOT_FOUND)
          .json({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(STATUS_OK).json({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный формат _id' });
      }
      return res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};

export const updateUser = (req: IRequest, res: Response) => {
  const {
    name,
    about,
  } = req.body;
  const userId = req.user?._id;

  if (!name || !about) {
    return res.status(STATUS_BAD_REQUEST)
      .json({ message: 'Переданы некорректные данные при обновлении профиля' });
  }

  return User.findByIdAndUpdate(userId, {
    name,
    about,
  }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(STATUS_NOT_FOUND)
          .json({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(STATUS_OK).json({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные при обновлении профиля' });
      } if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный формат _id' });
      }
      return res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};

export const updateUserAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  if (!avatar) {
    return res.status(STATUS_BAD_REQUEST)
      .json({ message: 'Переданы некорректные данные при обновлении аватара' });
  }
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(STATUS_NOT_FOUND)
          .json({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(STATUS_OK).json({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные при обновлении аватара' });
      } if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный формат _id' });
      }
      return res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};
