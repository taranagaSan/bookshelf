import { IsNotEmpty } from 'class-validator';
import { BookType } from '../enum/BookType';

export class BookCreateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  isbn?: string;

  @IsNotEmpty()
  bookType: BookType;

  image?: string;

  @IsNotEmpty()
  ownerId: number;

  description?: string;
}
