import {NextFunction, Request, Response} from 'express';
import Card from '../models/cards';
import { IRequest } from '../types/Request';
import {
  STATUS_OK,
} from '../constants/statusCodes';
import {BadRequestError, ForbiddenError, NotFoundError, ServerError} from "../utills";

export const createCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  return Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(STATUS_OK).json({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(new ServerError('Произошла ошибка'))
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.status(STATUS_OK).json({ data: cards }))
    .catch(() => next(new ServerError('Произошла ошибка')));

export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((updatedCard) => {
      return res.status(STATUS_OK).json({ data: updatedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }
      return next(new ServerError('Произошла ошибка'))
    });
};

export const dislikeCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((updatedCard) => {
      return res.status(STATUS_OK).json({ data: updatedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }
      return next(new ServerError('Произошла ошибка'))
    });
};

export const deleteCardById = async (req: IRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?._id;

  try {
    const card = await Card.findById(id);

    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    if (card.owner.toString() !== userId) {
      return next(new ForbiddenError('У вас нет прав на удаление этой карточки'));
    }

    const deletedCard = await Card.findByIdAndRemove(id);
    return res.status(STATUS_OK).json({ data: deletedCard });
  } catch (err: any) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный _id карточки'));
    }
    return next(new ServerError('Произошла ошибка'));
  }
};
