import { InfluxDBClient } from '@influxdata/influxdb3-client';
import { Injectable } from '@nestjs/common';
import { env } from 'process';
import { Author } from '../../lib/types';

@Injectable()
export class AuthorsService {
  private getInfluxDBClient() {
    const client = new InfluxDBClient({
      host: env.INFLUX_URL,
      token: env.INFLUX_TOKEN,
      database: env.INFLUX_BUCKET,
    });

    return client;
  }

  async getAuthors() {
    const client = this.getInfluxDBClient();

    const query =
      "SELECT url, last_value(name ORDER BY time) AS name FROM creators WHERE time >= now() - interval '7 days' GROUP BY url ORDER BY name;";
    const queryResult = await client.queryPoints(query, env.INFLUX_BUCKET);
    const resultsArray: Pick<Author, 'url' | 'name'>[] = [];

    for await (const row of queryResult) {
      const arrayElement = {
        url: row.getField('url', 'string'),
        name: row.getField('name', 'string'),
      };
      resultsArray.push(arrayElement);
    }

    client.close();
    return resultsArray;
  }
}
