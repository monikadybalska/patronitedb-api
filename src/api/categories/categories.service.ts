import { InfluxDBClient } from '@influxdata/influxdb3-client';
import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class CategoriesService {
  private getInfluxDBClient() {
    const client = new InfluxDBClient({
      host: env.INFLUX_URL,
      token: env.INFLUX_TOKEN,
      database: env.INFLUX_BUCKET,
    });

    return client;
  }

  async getCategories() {
    const client = this.getInfluxDBClient();

    const query = `SELECT DISTINCT * FROM (SELECT DISTINCT split_part(tags, ',', 1) AS tag FROM creators
                  UNION
                  SELECT DISTINCT split_part(tags, ',', 2) AS tag FROM creators
                  UNION
                  SELECT DISTINCT split_part(tags, ',', 3) AS tag FROM creators) WHERE length(tag) > 0ORDER by tag`;
    const queryResult = await client.queryPoints(query, env.INFLUX_BUCKET);
    const resultsArray: string[] = [];
    for await (const row of queryResult) {
      resultsArray.push(row.getField('tag', 'string'));
    }
    client.close();
    return resultsArray;
  }
}
