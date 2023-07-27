import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_OK, STATUS_SERVER_ERROR, STATUS_UNAUTHORIZED,
} from '../constants/statusCodes';
import User, { IUser } from '../models/user';
import { IRequest } from '../types/Request';

export const createUser = (req: Request, res: Response) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(STATUS_BAD_REQUEST).json({ message: 'Неверные данные запроса, отсутствует email или password' });
  }

  // Хеширование пароля перед сохранением в базу
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const userData: IUser = {
        name,
        about,
        avatar,
        email,
        password: hashedPassword, // Сохраняем хешированный пароль
      };

      return User.create(userData);
    })
    .then((newUser) => res.status(STATUS_OK).json({ data: newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка', error: err.message });
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(STATUS_BAD_REQUEST).json({ message: 'Неверные данные запроса, отсутствует email или password' });
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return res.status(STATUS_UNAUTHORIZED).json({ message: 'Неправильная почта или пароль' });
      }

      // Проверяем соответствие хешированного пароля
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(STATUS_UNAUTHORIZED).json({ message: 'Неправильная почта или пароль' });
          }

          const payload = {
            _id: user._id,
          };

          const token = jwt.sign(payload, 'some-secret-key', { expiresIn: '7d' });
          res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

          // Удаляем лишний вызов и вместо него отправляем ответ с токеном
          return res.status(STATUS_OK).json({ token, message: 'Авторизация произошла успешно' });
        })
        .catch((err) => res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка', error: err.message }));
    })
    .catch((err) => res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка', error: err.message }));
};

export const getCurrentUser = (req: IRequest, res: Response) => {
  const userId = req.user?._id;
  User.findById(userId)
    .then((user: IUser | null) => {
      if (!user) {
        return res.status(STATUS_SERVER_ERROR).json({ message: 'Пользователь не найден' });
      }

      return res.status(STATUS_OK).json({ data: user });
    })
    .catch((err: any) => res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка', error: err.message }));
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
