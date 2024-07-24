import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { env } from 'process';

@Controller('cron/authors')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll(@Req() request: Request) {
    if (request.headers.get('Authorization') !== `Bearer ${env.CRON_SECRET}`) {
      throw new UnauthorizedException();
    }
    return this.appService.writeToInfluxDB();
  }
}
