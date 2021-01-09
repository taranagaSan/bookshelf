import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateOrLoginUserDto {
  username?: string;

  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;
}
