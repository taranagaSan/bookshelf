import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookEntity } from './entity/book.entity';
import { BookCreateDto } from './dto/book.create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookDto } from './dto/book.dto';
import { ResponseService } from '../response.service';
import { BookMapper } from '../../serialization/book.mapper';

@Controller('books')
export class BooksController {
  constructor(private readonly _bookService: BooksService) {}

  @Get()
  async findAll(): Promise<BookDto[]> {
    const bookEntities = await this._bookService.findAll();

    return bookEntities.map<BookDto>(BookMapper.toBookDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookEntity> {
    return this._bookService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/',
    }),
  )
  async create(
    @UploadedFile() file,
    @Body() book: BookCreateDto,
  ): Promise<ResponseService<BookDto>> {
    const bookCreateDto = BookMapper.toBookSaveDto(file, book);
    const serviceResponse = await this._bookService.create(bookCreateDto);

    return {
      ...serviceResponse,
      data: BookMapper.toBookDto(serviceResponse.data),
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<BookEntity> {
    return this._bookService.remove(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() book: BookCreateDto,
  ): Promise<BookEntity> {
    return await this._bookService.update(book);
  }

  @Get('files/:id')
  async getFile(@Res() response: any, @Param('id') id: string) {
    const { isSuccess, data } = await this._bookService.getFileDescriptor(id);

    if (!isSuccess) {
      throw new HttpException('Файл не найден', HttpStatus.NOT_FOUND);
    }

    const fileStream = await this._bookService.getFile(data.filename);
    response.setHeader('Content-Type', data.mimetype);

    fileStream.pipe(response);
  }
}
