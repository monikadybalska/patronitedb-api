import { Controller, Get, Query } from '@nestjs/common';
import { RowCountService } from './row_count.service';

@Controller('row_count')
export class RowCountController {
  constructor(private readonly rowCountService: RowCountService) {}

  @Get()
  getRowCount(
    @Query('tags') tags?: string,
    @Query('name') name?: string,
    @Query('min_total_revenue') min_total_revenue?: number,
    @Query('max_total_revenue') max_total_revenue?: number,
    @Query('min_monthly_revenue') min_monthly_revenue?: number,
    @Query('max_monthly_revenue') max_monthly_revenue?: number,
    @Query('min_number_of_patrons') min_number_of_patrons?: number,
    @Query('max_number_of_patrons') max_number_of_patrons?: number,
  ) {
    return this.rowCountService.getRowCount({
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
