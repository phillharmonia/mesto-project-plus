import {NextFunction, Request, Response} from 'express';
import Card from '../models/cards';
import { IRequest } from '../types/Request';
import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR, STATUS_FORBIDDEN,
} from '../constants/statusCodes';

export const createCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  if (!name || !link) {
    return next({ status: STATUS_BAD_REQUEST, message: 'Переданы некорректные данные при создании карточки, отсутствует имя или ссылка' });
  }
  return Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(STATUS_OK).json({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next({ status: STATUS_BAD_REQUEST, message: 'Переданы некорректные данные при создании карточки' });
      }
      return next({ status: STATUS_SERVER_ERROR, message: 'Произошла ошибка' });
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.status(STATUS_OK).json({ data: cards }))
    .catch(() => next({ status: STATUS_SERVER_ERROR, message: 'Произошла ошибка' }));

export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return next({ status: STATUS_BAD_REQUEST, message: 'Переданы некорректные данные для постановки лайка' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return next({ status: STATUS_NOT_FOUND, message: 'Передан несуществующий _id карточки' });
      }
      return res.status(STATUS_OK).json({ data: updatedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next({ status: STATUS_BAD_REQUEST, message: 'Передан некорректный _id карточки' });
      }
      return next({ status: STATUS_SERVER_ERROR, message: 'Произошла ошибка' });
    });
};

export const dislikeCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return next({ status: STATUS_BAD_REQUEST, message: 'Переданы некорректные данные для снятия лайка' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return next({ status: STATUS_NOT_FOUND, message: 'Передан несуществующий _id карточки' });
      }
      return res.status(STATUS_OK).json({ data: updatedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next({ status: STATUS_BAD_REQUEST, message: 'Передан некорректный _id карточки' });
      }
      return next({ status: STATUS_SERVER_ERROR, message: 'Произошла ошибка' });
    });
};

export const deleteCardById = (req: IRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?._id;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        return next({ status: STATUS_NOT_FOUND, message: 'Карточка с указанным _id не найдена' });
      }

      if (card.owner.toString() !== userId) {
        return next({ status: STATUS_FORBIDDEN, message: 'У вас нет прав на удаление этой карточки' });
      }

      Card.findByIdAndRemove(id)
        .then((deletedCard) => {
          if (!deletedCard) {
            return next({ status: STATUS_NOT_FOUND, message: 'Карточка с указанным _id не найдена' });
          }
          return res.status(STATUS_OK).json({ data: deletedCard });
        })
        .catch((err: any) => {
          if (err.name === 'CastError') {
            return next({ status: STATUS_BAD_REQUEST, message: 'Передан некорректный _id карточки' });
          }
          return next({ status: STATUS_SERVER_ERROR, message: 'Произошла ошибка' });
        });
    })
    .catch((err: any) => {
      if (err.name === 'CastError') {
        return next({ status: STATUS_BAD_REQUEST, message: 'Передан некорректный _id карточки' });
      }
      return next({ status: STATUS_SERVER_ERROR, message: 'Произошла ошибка' });
    });
};
