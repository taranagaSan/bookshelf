import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { toUserDto } from '../../shared/mapper';
import { comparePasswords } from '../../shared/utils';
import { CreateOrLoginUserDto } from './dto/user.create.dto';
import { ResponseService } from '../response.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async findOne(options?: FindOneOptions<UserEntity>): Promise<UserDto> {
    const user = await this._userRepository.findOne(options);
    return toUserDto(user);
  }

  async create(
    userDto: CreateOrLoginUserDto,
  ): Promise<ResponseService<UserEntity>> {
    const { username, password, email } = userDto;

    // check if the user exist in the db
    const userInDb = await this._userRepository.findOne({ where: { email } });

    if (userInDb) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await this._userRepository.create({
      username,
      email,
      password,
    });

    await this._userRepository.save(user);

    return new ResponseService<UserEntity>(true, 'User was created', user);
  }

  async findByEmail({
    email,
    password,
  }: CreateOrLoginUserDto): Promise<UserDto> {
    const user = await this._userRepository.findOne({ where: { email } });

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

  async findAll(): Promise<UserDto[]> {
    const users = await this._userRepository.find();

    return users.map<UserDto>(toUserDto);
  }
}
