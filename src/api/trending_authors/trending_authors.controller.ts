import { Controller, Get, Query } from '@nestjs/common';
import { TrendingAuthorsService } from './trending_authors.service';

@Controller('trending_authors')
export class TrendingAuthorsController {
  constructor(
    private readonly trendingAuthorsService: TrendingAuthorsService,
  ) {}

  @Get()
  getTrendingAuthors(
    @Query('order') order: string,
    @Query('criterion') criterion: string,
    @Query('days') days: string,
  ) {
    return this.trendingAuthorsService.getTrendingAuthors(
      order,
      criterion,
      days,
    );
  }
}
