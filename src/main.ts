import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CrawlerService } from './crawler/crawler.service';
import { env } from 'process';
import 'dotenv/config';

async function runStandalone() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const crawlerService = app.get(CrawlerService);
  await crawlerService.writeToInfluxDB();
  app.close();
}

async function runApi() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(parseInt(process.env.PORT) || 3000);
}

async function bootstrap() {
  if (env.RUN_CRAWLER_AS_API === 'true') {
    await runApi();
  } else {
    await runStandalone();
  }
}
bootstrap();
