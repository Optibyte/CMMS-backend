import { Post, Controller, UseGuards, Request, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { UsersService } from 'src/app/api/users/user.service';
import { CreateUserDto } from 'src/app/api/users/dto/users.dto';
import { RouteConstants } from 'src/app/api/constants/route-constants';

@Controller()
export class AuthController {
  constructor(
    public readonly authService: AuthService,
    public readonly usersService: UsersService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post(RouteConstants.API_LOGIN)
  async login(@Request() req: any) {
    return this.authService.login(req);
  }

  @Post(RouteConstants.API_REGISTER_USER)
  @ApiBody({ type: CreateUserDto })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.registerUser(createUserDto);
  }
}
