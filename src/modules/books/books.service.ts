import * as fs from 'fs';
import * as path from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { BookEntity } from './entity/book.entity';
import { BookCreateDto } from './dto/book.create.dto';
import { ResponseService } from '../response.service';
import { IFileDescription } from './interfaces';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly _bookRepository: Repository<BookEntity>,
    private readonly _configService: ConfigService,
  ) {}

  findById(id: string) {
    return Promise.resolve(undefined);
  }

  async findAll(): Promise<BookEntity[]> {
    return await this._bookRepository.find();
  }

  async create(book: BookCreateDto): Promise<ResponseService<BookEntity>> {
    const { title, bookType } = book;
    let newBook: BookEntity;

    const bookInDb = await this._bookRepository.findOne({ where: { title } });

    if (bookInDb && bookInDb.bookType === bookType) {
      throw new HttpException('Book already exist', HttpStatus.BAD_REQUEST);
    }

    try {
      newBook = await this._bookRepository.save(book);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }

    return new ResponseService<BookEntity>(true, 'book was created', newBook);
  }

  remove(id: string) {
    return Promise.resolve(undefined);
  }

  update(book: BookCreateDto) {
    return Promise.resolve(undefined);
  }

  getFile(name: string) {
    return fs.createReadStream(
      path.join(this._configService.get('dataPath'), name),
    );
  }

  async getFileDescriptor(
    id: string,
  ): Promise<ResponseService<IFileDescription>> {
    const book: BookEntity = await this._bookRepository.findOne({
      where: { id: Number(id) },
    });

    if (!book) {
      return new ResponseService<IFileDescription>(
        false,
        'book was created',
        null,
      );
    }

    const fileDescriptor: IFileDescription = {
      filename: book.filename,
      originalname: book.originalname,
      size: book.size,
      mimetype: book.mimetype,
    };

    return new ResponseService<IFileDescription>(
      true,
      'book was created',
      fileDescriptor,
    );
  }
}
