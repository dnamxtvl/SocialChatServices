import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { APPLICATION_CONST } from 'src/const/application';
import { logger } from 'src/logs/nest.log';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'Authorization header is missing',
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'Token is missing',
            });
        }

        try {
            const response = await axios.post(APPLICATION_CONST.USER_API_HOST + APPLICATION_CONST.API_CHECK_LOGIN, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status !== HttpStatus.OK) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: 'Invalid token',
                });
            }

            req['user'] = response.data;
            next();
        } catch (error) {
            logger.error(error);
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: error.response.statusText,
            });
        }
    }
}
