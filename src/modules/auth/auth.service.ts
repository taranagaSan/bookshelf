import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { UserDto } from '../users/dto/user.dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<any> {
    try {
      await this._usersService.create(userDto);
      return true;
    } catch (err) {
      new HttpException(err.message, HttpStatus.BAD_REQUEST);
      return {
        message: err.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this._usersService.findByEmail(loginUserDto);
    const token = this._createToken(user);

    return {
      username: user.username,
      id: user.id,
      ...token,
    };
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
