import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { env } from 'process';

@Controller('cron/authors')
export class CrawlerController {
  constructor(private readonly appService: CrawlerService) {}

  @Get()
  findAll(@Headers('Authorization') cronSecret: string) {
    if (cronSecret !== `Bearer ${env.CRON_SECRET}`) {
      throw new UnauthorizedException();
    }
    return this.appService.writeToInfluxDB();
  }
}
