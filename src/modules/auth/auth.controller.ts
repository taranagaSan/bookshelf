import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { UsersService } from '../users/users.service';
// import { JwtAuthGuard } from './jwt.auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    const result: any = await this._authService.register(createUserDto);

    return result;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this._authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(@Body() loginUserDto: LoginUserDto): Promise<any> {
    const user = await this._usersService.findByPayload(loginUserDto);

    if (user) {
      return this._authService.login(loginUserDto);
    }
  }
}
