import User from '../models/users';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
export const createUser = async (userData: any) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error( (error as Error).message );
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error( (error as Error).message );
  }
};
export const getUserByEmail = async (email:string) => {
    return User.findOne({ email });
};
export const userLogin = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};
export const updateProfile = async (userId: string, updatedData: any) => {
  const user = await User.findByIdAndUpdate(userId, updatedData);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
// Generate a 6-digit token from UUID
const generateResetToken = (): string => {
  const uuid = uuidv4();
  const token = uuid.split('-').join('').substring(0, 6);
  return token;
};
// will be set in env
// process.env.EMAIL_USER
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'elmer.heaney@ethereal.email',
      pass: 'eb7akmTn8NWDvGtPxG'
  }
});

export const sendPasswordResetEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User with this email does not exist');
  }

  const resetToken = generateResetToken();
  const resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour

  user.resetToken = resetToken;
  user.resetTokenExpiration = resetTokenExpiration;
  await user.save();

  const mailOptions = {
    from: 'priyankapatel2281@gmail.com',
    to: user.email,
    subject: 'Password Reset',
    text: `You requested a password reset. Use the following token to reset your password: ${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
};
export const resetPasswordService = async (token: string, newPassword: string): Promise<void> => {
  const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: new Date() } })
    .select('+resetToken +resetTokenExpiration'); // Ensure these fields are selected
  
  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  // Update user's password
  user.password = await bcrypt.hash(newPassword, 8);
  user.resetToken = "null";
  user.resetTokenExpiration ;

  // Save the updated user
  await user.save();
};
