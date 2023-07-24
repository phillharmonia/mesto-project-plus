import { Router } from 'express';
import {
  createCard, getCards, getCardById, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

router.post('/cards', createCard);
router.get('/cards', getCards);
router.get('/cards/:id', getCardById);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

export default router;
