import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { env } from 'process';
import 'dotenv/config';

async function runStandalone() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const crawlerService = app.get(AppService);
  await crawlerService.writeToInfluxDB();
  app.close();
}

async function runApi() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

async function bootstrap() {
  if (env.RUN_CRAWLER_AS_API === 'true') {
    await runApi();
  } else {
    await runStandalone();
  }
}
bootstrap();
