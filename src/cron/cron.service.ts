import { Injectable, Logger } from '@nestjs/common';
// import { CrawlerService } from 'src/crawler/crawler.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  // constructor(private readonly appService: CrawlerService) {}
  private readonly logger = new Logger(CronService.name);

  @Cron('0 * * * * *')
  handleCron() {
    this.logger.debug('logger works');
    // return this.appService.writeToInfluxDB();
  }
}
