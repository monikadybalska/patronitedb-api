import { Controller, Get, Query } from '@nestjs/common';
import { AuthorService } from './author.service';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  getAuthorByUrl(@Query('url') url: string) {
    return this.authorService.getAuthorByUrl(url);
  }
}
