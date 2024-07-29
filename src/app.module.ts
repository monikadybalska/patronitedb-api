import { Module } from '@nestjs/common';

import { CrawlerController } from './crawler/crawler.controller';
import { AuthorController } from './api/author/author.controller';
import { CategoriesController } from './api/categories/categories.controller';

import { CrawlerService } from './crawler/crawler.service';
import { AuthorService } from './api/author/author.service';
import { CategoriesService } from './api/categories/categories.service';
import { TopAuthorsController } from './api/top_authors/top_authors.controller';
import { TopAuthorsService } from './api/top_authors/top_authors.service';
import { GainController } from './api/gain/gain.controller';
import { GainService } from './api/gain/gain.service';
import { TrendingAuthorsController } from './api/trending_authors/trending_authors.controller';
import { TrendingAuthorsService } from './api/trending_authors/trending_authors.service';
import { AuthorsController } from './api/authors/authors.controller';
import { AuthorsService } from './api/authors/authors.service';
import { RowCountController } from './api/row_count/row_count.controller';
import { RowCountService } from './api/row_count/row_count.service';
import { MinMaxController } from './api/min_max/min_max.controller';
import { MinMaxService } from './api/min_max/min_max.service';

@Module({
  imports: [],
  controllers: [
    CrawlerController,
    AuthorController,
    GainController,
    CategoriesController,
    TopAuthorsController,
    TrendingAuthorsController,
    AuthorsController,
    RowCountController,
    MinMaxController,
  ],
  providers: [
    CrawlerService,
    AuthorService,
    GainService,
    CategoriesService,
    TopAuthorsService,
    TrendingAuthorsService,
    AuthorsService,
    RowCountService,
    MinMaxService,
  ],
})
export class AppModule {}
