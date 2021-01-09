import { UserEntity } from '../modules/users/entity/user.entity';
import { UserDto } from '../modules/users/dto/user.dto';
import { BookEntity } from '../modules/books/entity/book.entity';
import { BookDto } from '../modules/books/dto/book.dto';
import { IMulterFile } from '../modules/books/interfaces';
import { BookCreateDto } from '../modules/books/dto/book.create.dto';
import { BookSaveDto } from '../modules/books/dto/book.save.dto';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email } = data;

  return {
    id,
    username,
    email,
  };
};

export const toBookSaveDto = (
  file: IMulterFile,
  data: BookCreateDto | BookEntity,
): BookCreateDto => {
  const bookDto = new BookSaveDto();
  bookDto.title = data.title;
  bookDto.author = data.author;
  bookDto.image = data.image;
  bookDto.ownerId = Number(data.ownerId);
  bookDto.bookType = Number(data.bookType);
  bookDto.filename = file.filename;
  bookDto.originalname = file.originalname;
  bookDto.size = file.size;
  bookDto.mimetype = file.mimetype;

  return bookDto;
};

export const toBookDto = (data: BookEntity): BookDto => {
  const bookDto = new BookDto();
  bookDto.id = data.id;
  bookDto.title = data.title;
  bookDto.author = data.author;
  bookDto.image = data.image;
  bookDto.ownerId = Number(data.ownerId);
  bookDto.bookType = Number(data.bookType);
  bookDto.filename = data.filename;
  bookDto.originalname = data.originalname;
  bookDto.size = data.size;
  bookDto.mimetype = data.mimetype;

  return bookDto;
};

// export const toBookEntity = (data: BookCreateDto): BookEntity => {
//   const bookEntity = new BookEntity();
//   bookEntity.title = data.title;
//   bookEntity.author = data.author;
//   bookEntity.bookType = data.bookType;
//   bookEntity.image = data.image;
//   bookEntity.description = data.description;
//   bookEntity.id = 0;
//   bookEntity.ownerId = data.ownerId;
//
//   return bookEntity;
// };
