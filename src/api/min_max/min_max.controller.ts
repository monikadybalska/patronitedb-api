import { Controller, Get } from '@nestjs/common';
import { MinMaxService } from './min_max.service';

@Controller('min_max')
export class MinMaxController {
  constructor(private readonly minMaxService: MinMaxService) {}

  @Get()
  getMinMax() {
    return this.minMaxService.getMinMax();
  }
}
