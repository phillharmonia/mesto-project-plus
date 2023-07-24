import { Request, Response } from 'express';
import Card from '../models/cards';
import { IRequest } from '../types/Request';

export const createCard = (req: IRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  if (!name || !link) {
    return res.status(400).json({ message: 'Переданы некорректные данные при создании карточки' });
  }
  return Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.json({ data: card }))
    .catch(() => res.status(500).json({ message: 'Произошла ошибка' }));
};

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.json({ data: cards }))
  .catch(() => res.status(500).json({ message: 'Произошла ошибка' }));

export const getCardById = (req: Request, res: Response) => {
  const { id } = req.params;
  return Card.findById(id)
    .then((card) => {
      if (!card) {
        return res.status(404).json({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.json({ data: card });
    })
    .catch(() => res.status(500).json({ message: 'Произошла ошибка' }));
};

export const likeCard = (req: IRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(400).json({ message: 'Переданы некорректные данные для постановки лайка' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(404).json({ message: 'Передан несуществующий _id карточки' });
      }
      return res.json({ data: updatedCard });
    })
    .catch(() => res.status(500).json({ message: 'Произошла ошибка' }));
};

export const dislikeCard = (req: IRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(400).json({ message: 'Переданы некорректные данные для снятия лайка' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(404).json({ message: 'Передан несуществующий _id карточки' });
      }
      return res.json({ data: updatedCard });
    })
    .catch(() => res.status(500).json({ message: 'Произошла ошибка' }));
};
