import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUsersById,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);

export default router;
