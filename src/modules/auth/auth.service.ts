import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { JwtPayload, LoginStatus } from './interfaces';
import { ResponseService } from '../response.service';
import { CreateOrLoginUserDto } from '../users/dto/user.create.dto';
import { UserEntity } from '../users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async register(
    userDto: CreateOrLoginUserDto,
  ): Promise<ResponseService<UserEntity>> {
    try {
      return await this._usersService.create(userDto);
    } catch (err) {
      return new ResponseService<UserEntity>(
        false,
        'User already exists',
        null,
      );
    }
  }

  async login(
    loginUserDto: CreateOrLoginUserDto,
  ): Promise<ResponseService<LoginStatus>> {
    try {
      const user = await this._usersService.findByEmail(loginUserDto);
      const token = this._createToken(user);
      const data: LoginStatus = {
        username: user.username,
        id: user.id,
        ...token,
      };

      return new ResponseService<LoginStatus>(true, 'User was loggedInn', data);
    } catch (err) {
      throw new HttpException(err.getResponse(), err.getStatus());
    }
  }

  private _createToken({ email }: UserDto): any {
    const expiresIn = process.env.EXPIRESIN;
    const user: JwtPayload = { email };
    const accessToken = this._jwtService.sign(user);

    return {
      expiresIn,
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this._usersService.findByPayload(payload);

    if (!user) {
      throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
