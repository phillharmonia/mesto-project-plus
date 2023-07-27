import { Router } from 'express';
import {
  getUsers,
  getUsersById,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);

export default router;
