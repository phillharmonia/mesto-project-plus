import { Router } from 'express';
import {
  getCurrentUser,
  getUsers,
  getUsersById,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';
import { updateUserAvatarValidation, updateUserValidation } from '../validation/validation';

const router = Router();
router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:id', getUsersById);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default router;
