import express from 'express';
import { login, getUserById, createUser, updateUserProfile, forgotPassword, resetPassword } from '../controller/users';
import { checkAuth } from '../middleware/auth';

const router = express.Router();

router.post('/', createUser);
router.get('/:userId', getUserById);
router.post('/login', login);
router.put('/profile', checkAuth("update_profile"), updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;
