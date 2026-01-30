import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import * as jwt from 'jsonwebtoken';
import Config from "../config/app";
import { UsersService } from 'src/app/api/users/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  private readonly secret: string = Config().jwtSecret;

  constructor(
    private readonly redisService: RedisCacheService,
    private readonly userService: UsersService
  ) { }

  /**
   * Middleware function to validate the JWT access token
   * and attach the authenticated user to the request object.
   */
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(' ')[0];
    if (!accessToken) {
      throw new HttpException('Token not provided', HttpStatus.UNAUTHORIZED);
    }
    try {
      const sessionData = await this.redisService.get(accessToken);

      if (sessionData) {

        // Retrieve the user from the database
        const user = await this.userService.findActiveUserById(sessionData.id);
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        req['user'] = user;
        next();

      } else {
        throw new HttpException('Invalid session token', HttpStatus.UNAUTHORIZED)
      }

    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

  }

}