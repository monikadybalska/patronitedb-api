import { Controller, Get, Query } from '@nestjs/common';
import { TopAuthorsService } from './top_authors.service';

@Controller('top_authors')
export class TopAuthorsController {
  constructor(private readonly topAuthorsService: TopAuthorsService) {}

  @Get()
  getTopAuthors(
    @Query('criterion') criterion: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('tags') tags?: string,
    @Query('name') name?: string,
    @Query('min_total_revenue') min_total_revenue?: number,
    @Query('max_total_revenue') max_total_revenue?: number,
    @Query('min_monthly_revenue') min_monthly_revenue?: number,
    @Query('max_monthly_revenue') max_monthly_revenue?: number,
    @Query('min_number_of_patrons') min_number_of_patrons?: number,
    @Query('max_number_of_patrons') max_number_of_patrons?: number,
  ) {
    return this.topAuthorsService.getTopAuthors({
      criterion,
      offset,
      limit,
      tags,
      name,
      min_total_revenue,
      max_total_revenue,
      min_monthly_revenue,
      max_monthly_revenue,
      min_number_of_patrons,
      max_number_of_patrons,
    });
  }
}
