import { NextFunction, Request, Response } from 'express';
import { ERROR_MESSAGE } from '../lib/constants';
import { 
  getUserById,
  getOrganizationsForUser,
} from '../models/user';

export const getCurrentUserWithOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [user, organizations] = await Promise.all([
      getUserById(req.user.id),
      getOrganizationsForUser(req.user.id),
    ]);
    if (!user) {
      const error = new Error(ERROR_MESSAGE.USER_NOT_FOUND);
      error.name = 'NotFoundError';
      throw error;
    }
    return res.status(200).json({
      success: true,
      user: {
        ...user,
        organizations,
      },
    });
  } catch (error: any) {
    next(error);
  }
};