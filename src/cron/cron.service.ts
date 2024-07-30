import { Injectable } from '@nestjs/common';
import { CrawlerService } from 'src/crawler/crawler.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(private readonly appService: CrawlerService) {}

  @Cron('40 17 * * * ')
  handleCron() {
    console.log('cron works');
    // return this.appService.writeToInfluxDB();
  }
}
