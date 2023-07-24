import { Router } from 'express';
import {
  createCard, getCards, getCardById, likeCard, dislikeCard, deleteCardById,
} from '../controllers/cards';

const router = Router();

router.post('/cards', createCard);
router.get('/cards', getCards);
router.get('/cards/:id', getCardById);
router.delete('/cards/:id', deleteCardById);
router.put('/cards/ :cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

export default router;
