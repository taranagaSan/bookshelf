import { BookCreateDto } from '../modules/books/dto/book.create.dto';
import { IMulterFile } from '../modules/books/interfaces';
import { BookSaveDto } from '../modules/books/dto/book.save.dto';
import { BookEntity } from '../modules/books/entity/book.entity';
import { BookDto } from '../modules/books/dto/book.dto';

export class BookMapper {
  public static toBookSaveDto(
    file: IMulterFile,
    data: BookCreateDto,
  ): BookCreateDto {
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
  }

  public static toBookDto(data: BookEntity): BookDto {
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
  }
}
