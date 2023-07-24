import { Request, Response } from 'express';
import User from '../models/user';
import { IRequest } from '../types/Request';

export const createUser = (req: Request, res: Response) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400)
      .json({ message: 'Неверные данные запроса, отсутствует имя, информация или аватар' });
  }
  return User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.json({ data: user }))
    .catch(() => res.status(500)
      .json({ message: 'Произошла ошибка' }));
};

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.json({ data: users }))
  .catch(() => res.status(500)
    .json({ message: 'Произошла ошибка' }));

export const getUsersById = (req: Request, res: Response) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404)
          .json({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.json({ data: user });
    })
    .catch(() => res.status(500)
      .json({ message: 'Произошла ошибка' }));
};

export const updateUser = (req: IRequest, res: Response) => {
  const {
    name,
    about,
  } = req.body;
  const userId = req.user?._id;

  if (!name || !about) {
    return res.status(400)
      .json({ message: 'Переданы некорректные данные при обновлении профиля' });
  }

  return User.findByIdAndUpdate(userId, {
    name,
    about,
  }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404)
          .json({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.json({ data: updatedUser });
    })
    .catch(() => res.status(500)
      .json({ message: 'Произошла ошибка' }));
};

export const updateUserAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  if (!avatar) {
    return res.status(400)
      .json({ message: 'Переданы некорректные данные при обновлении аватара' });
  }

  return User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404)
          .json({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.json({ data: updatedUser });
    })
    .catch(() => res.status(500)
      .json({ message: 'Произошла ошибка' }));
};
