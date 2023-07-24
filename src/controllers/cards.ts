import { Request, Response } from 'express';
import Card from '../models/cards';
import { IRequest } from '../types/Request';
import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR,
} from '../constants/statusCodes';

export const createCard = (req: IRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  if (!name || !link) {
    return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные при создании карточки' });
  }
  return Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(STATUS_OK).json({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.status(STATUS_OK).json({ data: cards }))
  .catch(() => res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка' }));

export const likeCard = (req: IRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные для постановки лайка' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(STATUS_NOT_FOUND).json({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(STATUS_OK).json({ data: updatedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Передан некорректный _id карточки' });
      }
      return res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};

export const dislikeCard = (req: IRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные для снятия лайка' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(STATUS_NOT_FOUND).json({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(STATUS_OK).json({ data: updatedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Передан некорректный _id карточки' });
      }
      return res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};

export const deleteCardById = (req: Request, res: Response) => {
  const { id } = req.params;

  Card.findByIdAndRemove(id)
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(STATUS_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(STATUS_OK).json({ data: deletedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Передан некорректный _id карточки' });
      }
      return res.status(STATUS_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};
