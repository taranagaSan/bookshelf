import { IsNotEmpty } from 'class-validator';
import { BookType } from '../enum/BookType';

export class BookDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  isbn?: string;

  bookType?: BookType;

  image?: string;

  @IsNotEmpty()
  ownerId: number;

  description?: string;

  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  originalname: string;

  @IsNotEmpty()
  size: number;

  @IsNotEmpty()
  mimetype: string;

  createdOn?: Date;
}
