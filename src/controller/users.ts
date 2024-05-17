import { Request, Response } from 'express';
import * as userService from '../services/users';
import jwt from 'jsonwebtoken'
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message }); 
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message }); 
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
      const { email, password } = req.body;
      const user = await userService.userLogin(email, password);
      const token = jwt.sign({ _id: user._id, email: user.email }, "secret9797979");
      res.status(200).send({
          type: 'success',
          data: { user, token },
          message: 'Logged in successfully.',
      });
  } catch (error) {
      res.status(400).json({ error: (error as Error).message });
  }
};
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.user)
    const userId = req.user?.id;
    const updatedData = req.body;
    const updatedUser = await userService.updateProfile(userId, updatedData);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await userService.sendPasswordResetEmail(email);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    await userService.resetPasswordService(token, newPassword);
    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};







