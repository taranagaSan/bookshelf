import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrLoginUserDto } from '../users/dto/user.create.dto';
import { ResponseService } from '../response.service';
import { LoginStatus } from './interfaces';
import { UserEntity } from '../users/entity/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { toUserDto } from '../../shared/mapper';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateOrLoginUserDto,
  ): Promise<ResponseService<UserDto>> {
    const newUser = new CreateOrLoginUserDto();
    newUser.username = createUserDto.username;
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    const result: ResponseService<UserEntity> = await this._authService.register(
      newUser,
    );

    if (!result.isSuccess) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return {
      ...result,
      data: toUserDto(result.data),
    };
  }

  @Post('login')
  async login(
    @Body() createOrLoginUserDto: CreateOrLoginUserDto,
  ): Promise<ResponseService<LoginStatus>> {
    try {
      return this._authService.login(createOrLoginUserDto);
    } catch (err) {
      throw new HttpException(err.getResponse(), err.getStatus());
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(@Body() loginUserDto: CreateOrLoginUserDto): Promise<any> {
    const user = await this._usersService.findByPayload(loginUserDto);

    if (user) {
      return this._authService.login(loginUserDto);
    }
  }
}
