import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, username: string, email: string) => {
  return jwt.sign({ userId, username, email }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
};