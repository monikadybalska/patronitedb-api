import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { env } from 'process';

@Controller('cron/authors')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll(@Headers('Authorization') cronSecret: string) {
    if (cronSecret !== `Bearer ${env.CRON_SECRET}`) {
      throw new UnauthorizedException();
    }
    return this.appService.writeToInfluxDB();
  }
}
