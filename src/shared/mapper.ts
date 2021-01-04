import { UserEntity } from '../modules/users/entity/user.entity';
import { UserDto } from '../modules/users/dto/user.dto';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email } = data;

  const userDto: UserDto = {
    id,
    username,
    email,
  };

  return userDto;
};
