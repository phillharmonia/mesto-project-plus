import { Router } from 'express';
import {
  createCard, getCards, likeCard, dislikeCard, deleteCardById,
} from '../controllers/cards';
import {createCardValidation, getCardValidation} from "../validation/validation";

const router = Router();

router.post('/', createCardValidation, createCard);
router.get('/', getCards);
router.delete('/:id', getCardValidation, deleteCardById);
router.put('/:cardId/likes', getCardValidation, likeCard);
router.delete('/:cardId/likes', getCardValidation, dislikeCard);

export default router;
