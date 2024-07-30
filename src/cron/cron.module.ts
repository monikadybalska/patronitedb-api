import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CrawlerService } from 'src/crawler/crawler.service';

@Module({
  providers: [CronService, CrawlerService],
})
export class CronModule {}
