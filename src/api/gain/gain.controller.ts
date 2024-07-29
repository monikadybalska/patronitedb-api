import { Controller, Get, Query } from '@nestjs/common';
import { GainService } from './gain.service';

@Controller('gain')
export class GainController {
  constructor(private readonly gainService: GainService) {}

  @Get()
  getGainByUrl(
    @Query('url') url: string,
    @Query('criterion') criterion: string,
  ) {
    return this.gainService.getGainByUrl({ url, criterion });
  }
}
