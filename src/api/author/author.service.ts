import { InfluxDBClient } from '@influxdata/influxdb3-client';
import { Injectable } from '@nestjs/common';
import { env } from 'process';
import { Author } from 'src/lib/types';
import { parseIntegerFields } from 'src/lib/utils';

@Injectable()
export class AuthorService {
  private getInfluxDBClient() {
    const client = new InfluxDBClient({
      host: env.INFLUX_URL,
      token: env.INFLUX_TOKEN,
      database: env.INFLUX_BUCKET,
    });

    return client;
  }

  async getAuthorByUrl(url: string) {
    const client = this.getInfluxDBClient();

    const query = `SELECT * FROM "creators" WHERE "url" LIKE '${url}' ORDER BY "time" DESC LIMIT 1`;
    const queryResult = await client.queryPoints(query, env.INFLUX_BUCKET);
    const resultsArray: Author[] = [];
    for await (const row of queryResult) {
      const integerFields = parseIntegerFields({ row });
      const arrayElement = {
        ...row['_tags'],
        ...integerFields,
        time: row.getTimestamp(),
      };
      resultsArray.push(arrayElement);
    }

    client.close();
    return resultsArray;
  }
}
