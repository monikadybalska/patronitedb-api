import { Controller, Get, Query } from '@nestjs/common';
import { TrendingAuthorsService } from './trending_authors.service';

@Controller('trending_authors')
export class TrendingAuthorsController {
  constructor(
    private readonly trendingAuthorsService: TrendingAuthorsService,
  ) {}

  @Get()
  getTrendingAuthors(@Query('criterion') criterion: string) {
    return this.trendingAuthorsService.getTrendingAuthors(criterion);
  }
}
