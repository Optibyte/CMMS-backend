import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request as Req, UserResponse } from 'src/app/api/users/user.interface';
import { UsersService } from 'src/app/api/users/user.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisCacheService
  ) { }

  async validateUser(username: string, pass: string): Promise<UserResponse> {
    const user = await this.usersService.validateUserCredentials(username, pass);
    if (user) {
      return user;
    }
    return null;
  }

  async login(request: Req) {

    const { user } = request;

    const payload = { username: user.username, id: user.id };
    const token = this.jwtService.sign(payload);

    // Store token in Redis
    await this.redisService.set(token, payload);

    return {
      ...user,
      accessToken: token
    };
  }
}
