import jwt from 'jsonwebtoken';
import { HttpStatus } from './httpStatus';
import { logger } from './logger';

export = (req: Request, res: Response, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        logger.debug(`req.headers.authorization: ${req.headers.authorization}`);
        logger.debug(`token: ${token}`);
        logger.debug(`JWT_KEY: ${process.env.JWT_KEY}`);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        logger.debug(`decoded: ${decoded}`);
        req.userData = decoded;
        logger.debug(`req.userData: ${req.userData}`);
        next();
    } catch (error) {
        return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: 'Auth failed' });
    }
};
