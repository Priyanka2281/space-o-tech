import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/users';
import { getUserById } from '../services/users';

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUser;
    }
}

export const checkAuth = (moduleName?: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        console.log("req.headers.authorization", req.headers.authorization)
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ type: Error, message: 'Please Login' });
            return;
        }
        try {
            const secret = process.env.secret||"secretkey";
            const decoded = await jwt.verify(token, secret) as { _id: string };
            const user = await getUserById(decoded._id);
            console.log("user", user)
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            if (moduleName && !user.accessModules.includes(moduleName)) {
                res.status(401).json({ message: 'You do not have permission to access this module' });
                return;
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
};
