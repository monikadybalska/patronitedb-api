import { Injectable } from '@nestjs/common';
import { CrawlerService } from 'src/crawler/crawler.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(private readonly appService: CrawlerService) {}

  @Cron('45 11 * * * ')
  handleCron() {
    return this.appService.writeToInfluxDB();
  }
}
