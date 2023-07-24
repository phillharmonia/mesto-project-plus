import { Router } from 'express';
import {
  createCard, getCards, likeCard, dislikeCard, deleteCardById,
} from '../controllers/cards';

const router = Router();

router.post('/cards', createCard);
router.get('/cards', getCards);
router.delete('/cards/:id', deleteCardById);
router.put('/cards/ :cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

export default router;
