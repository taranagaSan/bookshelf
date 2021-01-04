import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { toUserDto } from '../../shared/mapper';
import { CreateUserDto } from './dto/user.create.dto';
import { LoginUserDto } from './dto/user-login.dto';
import { comparePasswords } from '../../shared/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(options?: FindOneOptions<UserEntity>): Promise<UserDto> {
    const user = await this.userRepository.findOne(options);
    return toUserDto(user);
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { username, password, email } = userDto;

    // check if the user exist in the db
    const userInDb = await this.userRepository.findOne({ where: { email } });
    if (userInDb) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await this.userRepository.create({
      username,
      email,
      password,
    });

    await this.userRepository.save(user);

    return toUserDto(user);
  }

  async findByEmail({ email, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }

  async findByPayload({ email }: any): Promise<UserDto> {
    return await this.findOne({ where: { email } });
  }
}
