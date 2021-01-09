import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService<T> {
  constructor(
    public readonly isSuccess: boolean,
    public readonly message: string,
    public readonly data: T,
  ) {}
}
